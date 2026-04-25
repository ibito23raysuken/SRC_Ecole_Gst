import { Link } from "react-router-dom";
import { Brain, Heart, Sprout } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-red-50 min-h-screen">
      <main className="ml-20 md:ml-64 p-6 transition-all duration-300">

        {/* HERO */}
        <header className="relative h-[80vh] flex items-center justify-center text-white">
          <img
            src="https://images.unsplash.com/photo-1588072432836-e10032774350"
            alt="école"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-red-700/80"></div>

          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              École Primaire Les Savants
            </h1>
            <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto">
              Un environnement moderne pour développer le potentiel de chaque enfant
            </p>

            <Link
              to="/contact"
              className="bg-white text-red-700 px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transition shadow-lg"
            >
              Nous contacter
            </Link>
          </div>
        </header>

        {/* VALEURS */}
        <section className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Nos Valeurs
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Brain size={40} />,
                title: "Excellence Académique",
                desc: "Un programme adapté à chaque élève",
                img: "https://images.unsplash.com/photo-1509062522246-3755977927d7"
              },
              {
                icon: <Heart size={40} />,
                title: "Bienveillance",
                desc: "Un environnement positif et inclusif",
                img: "https://images.unsplash.com/photo-1577896851231-70ef18881754"
              },
              {
                icon: <Sprout size={40} />,
                title: "Développement Global",
                desc: "Intellectuel, physique et social",
                img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b"
              }
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.img}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                <div className="p-6 text-center">
                  <div className="flex justify-center text-red-700 mb-3">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ACTUALITÉS */}
        <section className="py-20 bg-white rounded-2xl shadow-inner">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-800">
            Actualités
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Portes Ouvertes",
                date: "15 Octobre 2023",
                img: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc"
              },
              {
                title: "Potager Éducatif",
                date: "5 Septembre 2023",
                img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399"
              },
              {
                title: "Rentrée Scolaire",
                date: "1 Septembre 2023",
                img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b"
              }
            ].map((news, i) => (
              <div
                key={i}
                className="bg-red-50 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={news.img}
                    alt=""
                    className="w-full h-full object-cover hover:scale-110 transition duration-500"
                  />
                </div>

                <div className="p-5">
                  <span className="text-sm text-red-600">{news.date}</span>
                  <h3 className="text-lg font-bold mt-2 text-gray-800">
                    {news.title}
                  </h3>

                  <Link
                    to="#"
                    className="inline-block mt-4 text-red-600 font-medium hover:underline"
                  >
                    Lire la suite →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
