import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { createTeacherApi } from "../../api/apiTeachers";
import { getSubjectsApi } from "../../api/apiSubjects";
import { getAllSchoolClassesApi } from "../../api/apiSchoolClasses";

import {
    Save,
    X,
    User,
    Lock,
    Eye,
    EyeOff,
    BookOpen,
    GraduationCap,
    Phone,
    Mail,
    Calendar,
    Banknote,
    Camera,
} from "lucide-react";

import { toast } from "react-hot-toast";

export default function CreateTeacher() {
    const navigate = useNavigate();
    const { token } = useContext(AppContext);

    // ============================================================
    // ETATS
    // ============================================================

    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});

    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [availableClasses, setAvailableClasses] = useState([]);
    const [availableSubjects, setAvailableSubjects] = useState([]);

    const [noClassMessage, setNoClassMessage] = useState(false);
    const [noSubjectMessage, setNoSubjectMessage] = useState(false);

    const [loadingData, setLoadingData] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    // ============================================================
    // NIVEAUX
    // ============================================================

    const levels = [
        "PS",
        "MS",
        "GS",
        "CP",
        "CE1",
        "CE2",
        "CM1",
        "CM2",
        "6e",
        "5e",
        "4e",
        "3e",
        "2nde",
        "1ère",
        "Term",
    ];

    const secondaryLevels = [
        "6e",
        "5e",
        "4e",
        "3e",
        "2nde",
        "1ère",
        "Term",
    ];

    // ============================================================
    // DONNEES ENSEIGNANT
    // ============================================================

    const [teacher, setTeacher] = useState({
        first_name: "",
        last_name: "",

        // Compte utilisateur
        password: "",
        password_confirmation: "",

        email: "",
        country_code: "+261",
        phone: "",

        level: "",
        current_class: "",
        subject: "",

        birth_date: "",
        salary: "",

        photo: null,
    });

    // ============================================================
    // NIVEAU SECONDAIRE
    // ============================================================

    const isSecondary = secondaryLevels.includes(
        teacher.level
    );

    // ============================================================
    // CLASSE CSS INPUT
    // ============================================================

    const inputClassName = (field) => {
        return `w-full px-4 py-3 rounded-xl bg-gray-50 border ${
            errors[field]
                ? "border-red-500 bg-red-50"
                : "border-gray-200"
        } focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all`;
    };

    // ============================================================
    // CHARGEMENT CLASSES + MATIERES
    // ============================================================

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;

            try {
                setLoadingData(true);

                const [
                    allClasses,
                    allSubjects,
                ] = await Promise.all([
                    getAllSchoolClassesApi(token),
                    getSubjectsApi(token),
                ]);

                setClasses(
                    Array.isArray(allClasses)
                        ? allClasses
                        : []
                );

                setSubjects(
                    Array.isArray(allSubjects)
                        ? allSubjects
                        : []
                );
            } catch (error) {
                console.error(
                    "Erreur chargement données :",
                    error
                );

                toast.error(
                    "Impossible de charger les classes et matières."
                );
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [token]);

    // ============================================================
    // FILTRAGE CLASSES / MATIERES
    // ============================================================

    useEffect(() => {
        if (!teacher.level) {
            setAvailableClasses([]);
            setAvailableSubjects([]);
            setNoClassMessage(false);
            setNoSubjectMessage(false);

            setTeacher((prev) => ({
                ...prev,
                current_class: "",
                subject: "",
            }));

            return;
        }

        // --------------------------------------------------------
        // CLASSES
        // --------------------------------------------------------

        const filteredClasses = classes.filter(
            (c) => c.level === teacher.level
        );

        if (filteredClasses.length > 0) {
            setAvailableClasses(filteredClasses);
            setNoClassMessage(false);
        } else {
            setAvailableClasses([]);
            setNoClassMessage(true);
        }

        // --------------------------------------------------------
        // MATIERES
        // --------------------------------------------------------

        if (isSecondary) {
            const filteredSubjects = subjects.filter(
                (s) => s.level === teacher.level
            );

            if (filteredSubjects.length > 0) {
                setAvailableSubjects(filteredSubjects);
                setNoSubjectMessage(false);
            } else {
                setAvailableSubjects([]);
                setNoSubjectMessage(true);
            }
        } else {
            setAvailableSubjects([]);
            setNoSubjectMessage(false);
        }

        // Reset sélection
        setTeacher((prev) => ({
            ...prev,
            current_class: "",
            subject: "",
        }));
    }, [
        teacher.level,
        classes,
        subjects,
        isSecondary,
    ]);

    // ============================================================
    // CHANGEMENT CHAMP
    // ============================================================

    const handleChange = (e) => {
        const {
            name,
            value,
            files,
        } = e.target;

        // PHOTO
        if (name === "photo") {
            const file = files?.[0] || null;

            setTeacher((prev) => ({
                ...prev,
                photo: file,
            }));

            if (preview) {
                URL.revokeObjectURL(preview);
            }

            setPreview(
                file
                    ? URL.createObjectURL(file)
                    : null
            );

            return;
        }

        setTeacher((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    // ============================================================
    // VALIDATION
    // ============================================================

    const validateForm = () => {
        const newErrors = {};

        if (!teacher.first_name.trim()) {
            newErrors.first_name =
                "Le prénom est obligatoire.";
        }

        if (!teacher.last_name.trim()) {
            newErrors.last_name =
                "Le nom est obligatoire.";
        }

        if (!teacher.password) {
            newErrors.password =
                "Le mot de passe est obligatoire.";
        } else if (teacher.password.length < 8) {
            newErrors.password =
                "Le mot de passe doit contenir au moins 8 caractères.";
        }

        if (
            teacher.password !==
            teacher.password_confirmation
        ) {
            newErrors.password_confirmation =
                "Les mots de passe ne correspondent pas.";
        }

        if (!teacher.level) {
            newErrors.level =
                "Veuillez choisir un niveau.";
        }

        if (
            teacher.level &&
            !noClassMessage &&
            !teacher.current_class
        ) {
            newErrors.current_class =
                "Veuillez choisir une classe.";
        }

        if (
            isSecondary &&
            !noSubjectMessage &&
            !teacher.subject
        ) {
            newErrors.subject =
                "Veuillez choisir une matière.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // ============================================================
    // CREATION ENSEIGNANT
    // ============================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (saving) return;

        setErrors({});

        if (!validateForm()) {
            toast.error(
                "Veuillez corriger les champs indiqués."
            );

            return;
        }

        try {
            setSaving(true);

            const formData = new FormData();

            // ====================================================
            // DONNEES ENSEIGNANT
            // ====================================================

            formData.append(
                "first_name",
                teacher.first_name
            );

            formData.append(
                "last_name",
                teacher.last_name
            );

            formData.append(
                "password",
                teacher.password
            );

            formData.append(
                "password_confirmation",
                teacher.password_confirmation
            );

            formData.append(
                "country_code",
                teacher.country_code
            );

            formData.append(
                "phone",
                teacher.phone
            );

            formData.append(
                "level",
                teacher.level
            );

            if (teacher.current_class) {
                formData.append(
                    "current_class",
                    teacher.current_class
                );
            }

            if (teacher.subject) {
                formData.append(
                    "subject",
                    teacher.subject
                );
            }

            if (teacher.birth_date) {
                formData.append(
                    "birth_date",
                    teacher.birth_date
                );
            }

            if (teacher.salary) {
                formData.append(
                    "salary",
                    teacher.salary
                );
            }

            if (teacher.photo) {
                formData.append(
                    "photo",
                    teacher.photo
                );
            }

            // ====================================================
            // API
            // ====================================================

            await createTeacherApi(
                formData,
                token
            );

            toast.success(
                "Enseignant créé avec succès."
            );

            navigate("/teachers");
        } catch (error) {
            console.error(
                "Erreur création enseignant :",
                error
            );

            const apiErrors =
                error.response?.data?.errors;

            if (apiErrors) {
                setErrors(apiErrors);
            }

            const message =
                error.response?.data?.message;

            if (message) {
                toast.error(message);
            } else {
                toast.error(
                    "Erreur lors de la création de l'enseignant."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // MESSAGE ERREUR
    // ============================================================

    const ErrorMessage = ({ field }) => {
        if (!errors[field]) {
            return null;
        }

        const error = Array.isArray(errors[field])
            ? errors[field][0]
            : errors[field];

        return (
            <p className="mt-1 text-xs text-red-600">
                {error}
            </p>
        );
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />

                    <p className="text-gray-600">
                        Chargement...
                    </p>

                </div>

            </div>
        );
    }

    // ============================================================
    // VIEW
    // ============================================================

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-6">

            <div className="max-w-6xl mx-auto">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="flex items-center justify-between mb-8">

                    <div className="flex items-center gap-3">

                        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">

                            <GraduationCap
                                size={24}
                                className="text-white"
                            />

                        </div>

                        <div>

                            <h1 className="text-3xl font-bold text-red-800">
                                Nouvel enseignant
                            </h1>

                            <p className="text-gray-500 text-sm">
                                Créer l'enseignant et son compte
                            </p>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    FORMULAIRE
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                >

                    <div className="grid lg:grid-cols-3 gap-6">

                        {/* =================================================
                            COLONNE GAUCHE
                        ================================================= */}

                        <div className="space-y-6">

                            {/* PHOTO */}

                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                                <h2 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">

                                    <Camera
                                        size={18}
                                        className="text-red-600"
                                    />

                                    Photo

                                </h2>

                                <div className="flex flex-col items-center">

                                    <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-100 border-4 border-red-100 flex items-center justify-center mb-5">

                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Aperçu"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User
                                                size={55}
                                                className="text-gray-300"
                                            />
                                        )}

                                    </div>

                                    <label className="cursor-pointer px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition text-sm font-medium">

                                        <span className="flex items-center gap-2">

                                            <Camera
                                                size={16}
                                            />

                                            Choisir une photo

                                        </span>

                                        <input
                                            type="file"
                                            name="photo"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </label>

                                </div>

                            </div>

                            {/* COMPTE UTILISATEUR */}

                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                                <div className="flex items-center gap-2 mb-5">

                                    <Lock
                                        size={18}
                                        className="text-red-600"
                                    />

                                    <div>

                                        <h2 className="font-semibold text-gray-800">
                                            Compte utilisateur
                                        </h2>

                                        <p className="text-xs text-gray-400">
                                            Identifiant de connexion
                                        </p>

                                    </div>

                                </div>

                                {/* IDENTIFIANT */}

                                <div className="mb-5">

                                    <label className="block text-sm font-medium text-gray-600 mb-2">

                                        Nom d'utilisateur

                                    </label>

                                    <div className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-700">

                                        {teacher.first_name ||
                                            "Le prénom sera utilisé"}

                                    </div>

                                    <p className="text-xs text-gray-400 mt-1">
                                        Le prénom sera utilisé
                                        comme identifiant de connexion.
                                    </p>

                                </div>

                                {/* PASSWORD */}

                                <div className="mb-5">

                                    <label className="block text-sm font-medium text-gray-600 mb-2">

                                        Mot de passe

                                    </label>

                                    <div className="relative">

                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={
                                                teacher.password
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Minimum 8 caractères"
                                            className={
                                                inputClassName(
                                                    "password"
                                                ) +
                                                " pr-12"
                                            }
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff
                                                    size={18}
                                                />
                                            ) : (
                                                <Eye
                                                    size={18}
                                                />
                                            )}
                                        </button>

                                    </div>

                                    <ErrorMessage
                                        field="password"
                                    />

                                </div>

                                {/* CONFIRMATION */}

                                <div>

                                    <label className="block text-sm font-medium text-gray-600 mb-2">

                                        Confirmation du mot de passe

                                    </label>

                                    <div className="relative">

                                        <input
                                            type={
                                                showPasswordConfirmation
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password_confirmation"
                                            value={
                                                teacher.password_confirmation
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Confirmer le mot de passe"
                                            className={
                                                inputClassName(
                                                    "password_confirmation"
                                                ) +
                                                " pr-12"
                                            }
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPasswordConfirmation(
                                                    !showPasswordConfirmation
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600"
                                        >
                                            {showPasswordConfirmation ? (
                                                <EyeOff
                                                    size={18}
                                                />
                                            ) : (
                                                <Eye
                                                    size={18}
                                                />
                                            )}
                                        </button>

                                    </div>

                                    <ErrorMessage
                                        field="password_confirmation"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            COLONNE DROITE
                        ================================================= */}

                        <div className="lg:col-span-2">

                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                                <div className="flex items-center gap-2 mb-6">

                                    <User
                                        size={20}
                                        className="text-red-600"
                                    />

                                    <div>

                                        <h2 className="font-semibold text-gray-800">
                                            Informations de l'enseignant
                                        </h2>

                                        <p className="text-xs text-gray-400">
                                            Informations personnelles et pédagogiques
                                        </p>

                                    </div>

                                </div>

                                <div className="grid md:grid-cols-2 gap-5">

                                    {/* PRENOM */}

                                    <div>

                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Prénom *
                                        </label>

                                        <input
                                            type="text"
                                            name="first_name"
                                            value={
                                                teacher.first_name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Prénom"
                                            className={inputClassName(
                                                "first_name"
                                            )}
                                        />

                                        <ErrorMessage
                                            field="first_name"
                                        />

                                    </div>

                                    {/* NOM */}

                                    <div>

                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Nom *
                                        </label>

                                        <input
                                            type="text"
                                            name="last_name"
                                            value={
                                                teacher.last_name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Nom"
                                            className={inputClassName(
                                                "last_name"
                                            )}
                                        />

                                        <ErrorMessage
                                            field="last_name"
                                        />

                                    </div>


                                    {/* TELEPHONE */}

                                    <div className="md:col-span-2">

                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">

                                            <Phone
                                                size={15}
                                                className="text-red-500"
                                            />

                                            Téléphone

                                        </label>

                                        <div className="flex gap-2">

                                            <select
                                                name="country_code"
                                                value={
                                                    teacher.country_code
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="px-3 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            >

                                                <option value="+261">
                                                    +261
                                                </option>

                                                <option value="+33">
                                                    +33
                                                </option>

                                                <option value="+1">
                                                    +1
                                                </option>

                                            </select>

                                            <input
                                                type="tel"
                                                name="phone"
                                                value={
                                                    teacher.phone
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="XX XX XXX XX"
                                                className={
                                                    inputClassName(
                                                        "phone"
                                                    ) +
                                                    " flex-1"
                                                }
                                            />

                                        </div>

                                    </div>

                                    {/* NIVEAU */}

                                    <div className="md:col-span-2">

                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">

                                            <BookOpen
                                                size={15}
                                                className="text-red-500"
                                            />

                                            Niveau *

                                        </label>

                                        <select
                                            name="level"
                                            value={
                                                teacher.level
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={inputClassName(
                                                "level"
                                            )}
                                        >

                                            <option value="">
                                                Choisir un niveau
                                            </option>

                                            {levels.map(
                                                (level) => (
                                                    <option
                                                        key={
                                                            level
                                                        }
                                                        value={
                                                            level
                                                        }
                                                    >
                                                        {level}
                                                    </option>
                                                )
                                            )}

                                        </select>

                                        <ErrorMessage
                                            field="level"
                                        />

                                    </div>

                                    {/* CLASSE */}

                                    {teacher.level && (
                                        <div className="md:col-span-2">

                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                Classe *
                                            </label>

                                            {noClassMessage ? (
                                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">

                                                    <p className="text-sm text-yellow-700">
                                                        Aucune classe disponible
                                                        pour{" "}
                                                        <strong>
                                                            {
                                                                teacher.level
                                                            }
                                                        </strong>
                                                        .
                                                    </p>

                                                </div>
                                            ) : (
                                                <select
                                                    name="current_class"
                                                    value={
                                                        teacher.current_class
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    className={inputClassName(
                                                        "current_class"
                                                    )}
                                                >

                                                    <option value="">
                                                        Choisir une classe
                                                    </option>

                                                    {availableClasses.map(
                                                        (c) => (
                                                            <option
                                                                key={
                                                                    c.id
                                                                }
                                                                value={
                                                                    c.name
                                                                }
                                                            >
                                                                {
                                                                    c.name
                                                                }
                                                            </option>
                                                        )
                                                    )}

                                                </select>
                                            )}

                                            <ErrorMessage
                                                field="current_class"
                                            />

                                        </div>
                                    )}

                                    {/* MATIERE */}

                                    {isSecondary && (
                                        <div className="md:col-span-2">

                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                Matière *
                                            </label>

                                            {noSubjectMessage ? (
                                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">

                                                    <p className="text-sm text-yellow-700">
                                                        Aucune matière disponible
                                                        pour{" "}
                                                        <strong>
                                                            {
                                                                teacher.level
                                                            }
                                                        </strong>
                                                        .
                                                    </p>

                                                </div>
                                            ) : (
                                                <select
                                                    name="subject"
                                                    value={
                                                        teacher.subject
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    className={inputClassName(
                                                        "subject"
                                                    )}
                                                >

                                                    <option value="">
                                                        Choisir une matière
                                                    </option>

                                                    {availableSubjects.map(
                                                        (s) => (
                                                            <option
                                                                key={
                                                                    s.id
                                                                }
                                                                value={
                                                                    s.name
                                                                }
                                                            >
                                                                {
                                                                    s.name
                                                                }
                                                            </option>
                                                        )
                                                    )}

                                                </select>
                                            )}

                                            <ErrorMessage
                                                field="subject"
                                            />

                                        </div>
                                    )}

                                    {/* DATE NAISSANCE */}

                                    <div>

                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">

                                            <Calendar
                                                size={15}
                                                className="text-red-500"
                                            />

                                            Date de naissance

                                        </label>

                                        <input
                                            type="date"
                                            name="birth_date"
                                            value={
                                                teacher.birth_date
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={inputClassName(
                                                "birth_date"
                                            )}
                                        />

                                    </div>

                                    {/* SALAIRE */}

                                    <div>

                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">

                                            <Banknote
                                                size={15}
                                                className="text-red-500"
                                            />

                                            Salaire

                                        </label>

                                        <div className="relative">

                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                name="salary"
                                                value={
                                                    teacher.salary
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Salaire"
                                                className={
                                                    inputClassName(
                                                        "salary"
                                                    ) +
                                                    " pr-16"
                                                }
                                            />

                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                                MGA
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* INFO */}

                            <div className="mt-6 p-5 bg-red-50 border border-red-100 rounded-2xl">

                                <div className="flex gap-3">

                                    <Lock
                                        size={20}
                                        className="text-red-600 flex-shrink-0"
                                    />

                                    <div>

                                        <h3 className="font-semibold text-red-800">
                                            Connexion enseignant
                                        </h3>

                                        <p className="text-sm text-red-700 mt-1">
                                            Le prénom de l'enseignant
                                            sera utilisé comme
                                            nom d'utilisateur.
                                            Le mot de passe défini
                                            ci-dessus permettra à
                                            l'enseignant de se connecter.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        BOUTONS
                    ================================================= */}

                    <div className="flex justify-end gap-4 mt-8">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/teachers")
                            }
                            disabled={saving}
                            className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center gap-2"
                        >

                            <X size={17} />

                            Annuler

                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="px-7 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white r ounded-xl shadow-lg disabled:opacity-60 flex items-center gap-2"
                        >

                            {saving ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />

                                    Création...
                                </>
                            ) : (
                                <>
                                    <Save size={17} />

                                    Créer l'enseignant
                                </>
                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}
