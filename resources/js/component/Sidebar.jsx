import { useState } from 'react';
import {
  PiStudentFill,
  PiChalkboardTeacherFill,
  PiBooksFill,
  PiGearFill,
  PiCaretDown,
  PiCaretRight
} from "react-icons/pi";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  // Structure des menus et sous-menus
  const menuItems = [
    {
      id: 'students',
      title: "Étudiants",
      icon: <PiStudentFill className="text-2xl" />,
      subMenus: [
        { title: "Nouveau étudiant", path: "/students/create" },
        { title: "Liste étudiants", path: "/students" },
        { title: "Statistiques", path: "/students/stats" }
      ]
    },
    {
      id: 'teachers',
      title: "Enseignants",
      icon: <PiChalkboardTeacherFill className="text-2xl" />,
      subMenus: [
        { title: "Ajouter enseignant", path: "/teachers/create" },
        { title: "Liste enseignants", path: "/teachers/list" }
      ]
    },
    {
      id: 'classes',
      title: "Classes",
      icon: <PiBooksFill className="text-2xl" />,
      subMenus: [
        { title: "Créer une classe", path: "/classes/create" },
        { title: "Liste des classes", path: "/classes/list" },
        { title: "Emplois du temps", path: "/classes/schedule" }
      ]
    },
    {
      id: 'settings',
      title: "Paramètres",
      icon: <PiGearFill className="text-2xl" />,
      path: "/settings"
    }
  ];

  const toggleMenu = (menuId) => {
    if (activeMenu === menuId) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuId);
    }
  };

  return (
    <div
      className={`fixed top-40 left-4 z-40 transition-all duration-300 ease-in-out
        ${open ? 'w-60' : 'w-16'}
        h-[calc(100vh-20rem)] bg-gradient-to-b from-red-700 to-red-800 shadow-xl
        rounded-2xl flex flex-col justify-between
        hover:w-60`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="p-4 space-y-1">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-1">
            {/* Bouton principal du menu */}
            <button
              onClick={() => item.subMenus ? toggleMenu(item.id) : null}
              className={`w-full flex items-center gap-4 text-white hover:bg-red-600 rounded-lg px-3 py-3 transition
                ${open ? 'justify-between' : 'justify-center'}`}
            >
              <div className="flex items-center gap-4">
                <span>{item.icon}</span>
                {open && <span className="font-medium">{item.title}</span>}
              </div>

              {open && item.subMenus && (
                <span>
                  {activeMenu === item.id ? <PiCaretDown /> : <PiCaretRight />}
                </span>
              )}
            </button>

            {/* Sous-menus */}
            {open && activeMenu === item.id && item.subMenus && (
              <div className="mt-1 ml-8 space-y-1 border-l-2 border-red-500 pl-2">
                {item.subMenus.map((subMenu, index) => (
                  <a
                    key={index}
                    href={subMenu.path}
                    className="block py-2 px-3 text-white hover:bg-red-600 rounded-lg transition text-sm"
                  >
                    {subMenu.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 text-center text-xs text-white opacity-70">
        {open && '© 2025 Les Savants'}
      </div>
    </div>
  );
}
