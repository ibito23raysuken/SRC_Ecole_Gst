import { Link } from 'react-router-dom';


export default function Home() {
  return (
     <div className="bg-red-50 min-h-screen ">
      <main className="ml-20 md:ml-64 p-6 transition-all duration-300">

    <div className="min-h-screen bg-red-50">

      {/* Hero Section avec dégradé rouge */}
      <header className="relative bg-gradient-to-r from-red-700 to-red-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Bienvenue à l'École Primaire Les Savants
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Un environnement d'apprentissage stimulant pour éveiller la curiosité de chaque enfant
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="border-2 border-white hover:bg-white hover:text-red-800 px-8 py-3 rounded-lg font-bold text-lg transition duration-300"
            >
              Nous contacter
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white transform skew-y-1 origin-top-left"></div>
      </header>

      {/* Valeurs de l'école avec fond blanc */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Nos Valeurs Pédagogiques</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🧠',
                title: 'Excellence Académique',
                description: 'Un programme rigoureux adapté à chaque niveau'
              },
              {
                icon: '❤️',
                title: 'Bienveillance',
                description: 'Un climat scolaire positif et inclusif'
              },
              {
                icon: '🌱',
                title: 'Développement Global',
                description: 'Éducation intellectuelle, physique et sociale'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-red-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-red-100"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-red-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Actualités avec thème rouge */}
      <section className="py-16 bg-red-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-800">Dernières Actualités</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Portes Ouvertes 2023',
                date: '15 Octobre 2023',
                excerpt: 'Venez découvrir notre établissement et nos méthodes pédagogiques'
              },
              {
                title: 'Nouveau Potager Éducatif',
                date: '5 Septembre 2023',
                excerpt: 'Un espace dédié à l\'éducation au développement durable'
              },
              {
                title: 'Rentrée Scolaire',
                date: '1 Septembre 2023',
                excerpt: 'Toutes les informations pratiques pour la rentrée'
              }
            ].map((news, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 border-t-4 border-red-600"
              >
                <div className="h-48 bg-red-100"></div>
                <div className="p-6">
                  <span className="text-sm text-red-600">{news.date}</span>
                  <h3 className="text-xl font-bold my-2 text-gray-800">{news.title}</h3>
                  <p className="text-gray-600 mb-4">{news.excerpt}</p>
                  <Link to="#" className="text-red-600 hover:underline font-medium">
                    Lire la suite →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>

      </main>
    </div>
      );
}
