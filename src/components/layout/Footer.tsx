'use client';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-emerald-600 mb-4">
              Roomzy
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Tu plataforma confiable para encontrar el hogar perfecto. 
              Conectamos arrendadores y buscadores de manera segura y eficiente.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/dashboard" 
                  className="text-slate-600 hover:text-emerald-600 text-sm transition-colors duration-200"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-slate-600 hover:text-emerald-600 text-sm transition-colors duration-200"
                >
                  Buscar Propiedades
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-slate-600 hover:text-emerald-600 text-sm transition-colors duration-200"
                >
                  Publicar Propiedad
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-slate-600 hover:text-emerald-600 text-sm transition-colors duration-200"
                >
                  Mi Perfil
                </a>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Soporte
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-slate-600 hover:text-emerald-600 text-sm transition-colors duration-200"
                >
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-slate-600 hover:text-emerald-600 text-sm transition-colors duration-200"
                >
                  Contacto
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-slate-600 hover:text-emerald-600 text-sm transition-colors duration-200"
                >
                  Términos de Uso
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-slate-600 hover:text-emerald-600 text-sm transition-colors duration-200"
                >
                  Privacidad
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Roomzy. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a 
                href="#" 
                className="text-slate-400 hover:text-slate-500 transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-slate-500 transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm4.5 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-slate-500 transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 