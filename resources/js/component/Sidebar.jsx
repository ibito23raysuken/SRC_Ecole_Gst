import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  PiStudentFill,
  PiChalkboardTeacherFill,
  PiBooksFill,
  PiGearFill,
  PiCaretDown,
  PiCaretRight,
  PiBookOpenFill,
  PiCalendarFill,
} from "react-icons/pi";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const location = useLocation();

  // Définir menuItems à l'intérieur du composant pour éviter undefined
  const menuItems = [
    {
      id: "students",
      title: "Étudiants",
      icon: <PiStudentFill className="text-2xl" />,
      subMenus: [
        { title: "Nouveau étudiant", path: "/students/create" },
        { title: "Liste étudiants", path: "/students" },
        { title: "Statistiques", path: "/students/SchoolDashboard" },
      ],
    },
    {
      id: "teachers",
      title: "Enseignants",
      icon: <PiChalkboardTeacherFill className="text-2xl" />,
      subMenus: [
        { title: "Ajouter enseignant", path: "/teachers/create" },
        { title: "Liste enseignants", path: "/teachers" },
      ],
    },
    {
      id: "classes",
      title: "Classes",
      icon: <PiBooksFill className="text-2xl" />,
      subMenus: [
        { title: "Créer une classe", path: "/SchoolClass/create" },
        { title: "Liste des classes", path: "/SchoolClass/list" },
      ],
    },
    {
      id: "subjects",
      title: "Matières",
      icon: <PiBookOpenFill className="text-2xl" />,
      subMenus: [
        { title: "Ajouter matière", path: "/subjects/create" },
        { title: "Liste matières", path: "/subjects/Liste_Subject" },
      ],
    },
    {
      id: "schedule",
      title: "Outils",
      icon: <PiCalendarFill className="text-2xl" />,
      subMenus: [
        { title: "Configurer emploi du temps", path: "/schedule" },
        { title: "Insertion note", path: "/Note" },
      ],
    },
    {
      id: "settings",
      title: "Paramètres",
      icon: <PiGearFill className="text-2xl" />,
      path: "/parametre",
    },
  ];

  const toggleMenu = (menuId) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  return (
    <div
      className={`fixed top-20 left-4 z-40 transition-all duration-300 ease-in-out mt-4
        ${open ? "w-60" : "w-16"} max-h-[90vh] overflow-y-auto
        bg-gradient-to-b from-red-700 to-red-800 shadow-xl rounded-2xl flex flex-col justify-between hover:w-60`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* MENU */}
      <div className="p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            item.subMenus?.some((sub) => location.pathname.startsWith(sub.path));

          return (
            <div key={item.id} className="mb-1">
              {item.subMenus ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`w-full flex items-center gap-4 text-white rounded-lg px-3 py-3 transition
                      ${open ? "justify-between" : "justify-center"}
                      ${isActive ? "bg-red-600" : "hover:bg-red-600"}`}
                  >
                    <div className="flex items-center gap-4">
                      <span>{item.icon}</span>
                      {open && <span className="font-medium">{item.title}</span>}
                    </div>
                    {open && (
                      <span>{activeMenu === item.id ? <PiCaretDown /> : <PiCaretRight />}</span>
                    )}
                  </button>

                  {open && activeMenu === item.id && (
                    <div className="mt-1 ml-8 space-y-1 border-l-2 border-red-500 pl-2">
                      {item.subMenus.map((subMenu, index) => {
                        const isSubActive = location.pathname === subMenu.path;
                        return (
                          <Link
                            key={index}
                            to={subMenu.path}
                            className={`block py-2 px-3 text-white rounded-lg transition text-sm
                              ${isSubActive ? "bg-red-600" : "hover:bg-red-600"}`}
                          >
                            {subMenu.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`w-full flex items-center gap-4 text-white rounded-lg px-3 py-3 transition
                    ${open ? "justify-start" : "justify-center"}
                    ${isActive ? "bg-red-600" : "hover:bg-red-600"}`}
                >
                  <span>{item.icon}</span>
                  {open && <span className="font-medium">{item.title}</span>}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="p-4 text-center text-xs text-white opacity-70">
        {open && "© 2026 ERP Scolaire"}
      </div>
    </div>
  );
}
