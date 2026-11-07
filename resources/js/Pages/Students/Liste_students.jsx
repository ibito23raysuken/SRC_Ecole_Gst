import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { AppContext } from "../../Context/AppContext";
import { deleteStudentApi, getAllStudentsApi } from "../../api/apistudents";
import { getAllSchoolClassesApi } from "../../api/apiSchoolClasses";
import { getAcademicYearsApi } from "../../api/academicYearApi";
import StudentFilters from "./StudentFilters";
import StudentStats from "./StudentStats";
import StudentTable from "./StudentTable";
import StudentPagination from "./StudentPagination";

const initialFilters = { search: "", school_class_id: "", academic_year_id: "", month: "", payment_status: "", fee_type: "all", balance_min: "", balance_max: "", paid_state: "", sort: "last_name", direction: "asc" };
const emptyStats = { total: 0, paid: 0, unpaid: 0, partial: 0, total_balance: 0 };

export default function StudentList() {
  const { token } = useContext(AppContext);
  const [filters, setFilters] = useState(initialFilters);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    if (!token) return;
    Promise.all([getAllSchoolClassesApi(token), getAcademicYearsApi(token)])
      .then(([loadedClasses, loadedYears]) => { setClasses(loadedClasses); setAcademicYears(loadedYears); })
      .catch(() => toast.error("Impossible de charger les filtres scolaires."));
  }, [token]);

  const queryParams = useMemo(() => Object.fromEntries(Object.entries({ ...filters, page, per_page: 8 }).filter(([, value]) => value !== "" && value !== null && value !== undefined)), [filters, page]);
  const loadStudents = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await getAllStudentsApi(queryParams);
      setStudents(response.data || []); setMeta(response.meta || null); setStats(response.meta?.stats || emptyStats);
    } catch (error) { toast.error(error.response?.data?.message || "Erreur de chargement des élèves."); }
    finally { setLoading(false); }
  }, [queryParams, token]);

  useEffect(() => { loadStudents(); }, [loadStudents]);

  const updateFilter = (key, value) => { setFilters((current) => ({ ...current, [key]: value })); setPage(1); };
  const resetFilters = () => { setFilters(initialFilters); setPage(1); };
  const removeFilter = (key) => updateFilter(key, key === "fee_type" ? "all" : "");
  const setStatus = (status) => { setFilters((current) => ({ ...current, payment_status: status, paid_state: "" })); setPage(1); };
  const sortBy = (sort) => { setFilters((current) => ({ ...current, sort, direction: current.sort === sort && current.direction === "asc" ? "desc" : "asc" })); setPage(1); };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    try { await deleteStudentApi(studentToDelete); toast.success("Élève supprimé avec succès."); setStudentToDelete(null); await loadStudents(); }
    catch (error) { toast.error(error.response?.data?.message || "Erreur lors de la suppression."); }
  };

  return <div className="space-y-6"><Toaster position="top-right" /><div className="mx-auto max-w-7xl">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold text-gray-800 md:text-3xl">Liste des élèves</h1><p className="mt-1 text-sm text-gray-500">Recherche et suivi des paiements avec les données disponibles.</p></div><Link to="/students/create" className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white shadow-sm hover:bg-red-700">+ Ajouter un élève</Link></div>
    <StudentStats stats={stats} onStatus={setStatus} />
    <StudentFilters filters={filters} classes={classes} academicYears={academicYears} onChange={updateFilter} onApply={() => setPage(1)} onReset={resetFilters} onRemove={removeFilter} />
    <div className="mb-3 text-sm text-gray-500">{meta?.total ?? 0} résultat{(meta?.total ?? 0) > 1 ? "s" : ""}</div>
    <StudentTable students={students} loading={loading} onDelete={setStudentToDelete} onSort={sortBy} sort={filters.sort} direction={filters.direction} /><StudentPagination meta={meta} onPage={setPage} />
  </div>{studentToDelete && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"><h2 className="text-xl font-bold text-red-700">Supprimer cet élève ?</h2><p className="my-4 text-gray-600">Cette action est irréversible.</p><div className="flex justify-end gap-3"><button type="button" onClick={() => setStudentToDelete(null)} className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300">Annuler</button><button type="button" onClick={confirmDelete} className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">Supprimer</button></div></div></div>}</div>;
}
