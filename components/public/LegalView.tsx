
import React, { useState, useEffect } from 'react';
import { PageView } from '../../types';
import { ArrowLeft, Shield, Scale, FileText, Lock, Check } from 'lucide-react';
import { Logo } from '../shared/Logo';

interface LegalViewProps {
  onNavigate: (view: PageView) => void;
  initialTab?: Tab;
}

type Tab = 'privacy' | 'terms' | 'transparency' | 'cookies';

export default function LegalView({ onNavigate, initialTab = 'terms' }: LegalViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-bgMain font-sans text-textMain flex flex-col md:flex-row">

      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className="w-full md:w-1/4 bg-white border-r border-gray-200 md:h-screen md:sticky md:top-0 z-20 flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center md:block">
          <div className="flex items-center gap-2 cursor-pointer mb-0 md:mb-6" onClick={() => onNavigate('landing')}>
            <Logo className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg text-gray-900">Donify Legal</span>
          </div>
          <button onClick={() => onNavigate('landing')} className="md:hidden text-gray-500">
            <ArrowLeft />
          </button>
        </div>

        <nav className="flex-1 overflow-x-auto md:overflow-visible flex md:flex-col p-4 gap-2">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'terms' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Scale size={18} /> Términos y Condiciones
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'privacy' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Shield size={18} /> Política de Privacidad
          </button>
          <button
            onClick={() => setActiveTab('cookies')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'cookies' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Lock size={18} /> Política de Cookies
          </button>
          <button
            onClick={() => setActiveTab('transparency')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'transparency' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <FileText size={18} /> Transparencia
          </button>
        </nav>

        <div className="p-6 mt-auto hidden md:block">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} /> Volver a la App
          </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 p-6 md:p-12 md:max-w-4xl">

        {/* Summary Section - redesign */}
        <div className="mb-12 pl-6 border-l-4 border-primary/60 py-2">
          <h4 className="text-gray-900 font-bold mb-2 text-lg flex items-center gap-2">
            En Resumen
          </h4>
          <p className="text-gray-600 text-lg leading-relaxed italic">
            {activeTab === 'terms' && "Al donar, aceptas que el voto es vinculante y el dinero no es reembolsable. El 100% del beneficio neto va a las causas elegidas."}
            {activeTab === 'privacy' && "Tus datos son sagrados. Solo los usamos para procesar pagos y cumplir la ley. Jamás los vendemos."}
            {activeTab === 'cookies' && "Solo usamos las cookies estrictamente necesarias para que la web funcione y sea segura."}
            {activeTab === 'transparency' && "Somos una asociación sin ánimo de lucro. Cobramos solo lo necesario para cubrir costes operativos y pasarelas de pago."}
          </p>
        </div>

        <div className="prose prose-slate max-w-none">
          {activeTab === 'terms' && <TermsContent />}
          {activeTab === 'privacy' && <PrivacyContent />}
          {activeTab === 'cookies' && <CookiesContent />}
          {activeTab === 'transparency' && <TransparencyContent />}
        </div>

      </main>
    </div>
  );
}

function InfoIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}

/* --- STATIC CONTENT COMPONENTS FROM TEXT DUMP --- */

const TermsContent = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-2">Términos y Condiciones</h1>
    <span className="text-xs text-gray-400 block mb-8">Última actualización: Octubre 2024</span>

    <h3>1. Naturaleza de las donaciones</h3>
    <p>Todas las donaciones realizadas son voluntarias y no reembolsables, bajo ninguna circunstancia. Una vez efectuado el aporte y cerrado el ciclo de votación, los fondos se transfieren automáticamente.</p>

    <h3>2. Destino y Reparto</h3>
    <p>El total recaudado será distribuido exclusivamente entre las tres (3) ONG más votadas por la comunidad según el siguiente esquema:</p>
    <ul>
      <li><strong>1.er lugar:</strong> 50 % del total recaudado</li>
      <li><strong>2.º lugar:</strong> 30 % del total recaudado</li>
      <li><strong>3.er lugar:</strong> 20 % del total recaudado</li>
    </ul>

    <h3>3. Sistema de Votación</h3>
    <p>Los resultados finales dependen única y exclusivamente del sistema de votación habilitado. Donify no garantiza que una ONG específica gane. En caso de detección de fraude (bots, multicuentas), nos reservamos el derecho de anular esos votos.</p>

    <h3>4. Tratamiento Fiscal</h3>
    <p>Las donaciones realizadas a través de la plataforma pueden dar derecho a deducción fiscal conforme a la legislación española. El usuario es responsable de proporcionar sus datos fiscales correctos en su perfil.</p>
  </div>
);

const PrivacyContent = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
    <span className="text-xs text-gray-400 block mb-8">RGPD Compliant • Última actualización: Octubre 2024</span>

    <h3>1. Responsable del Tratamiento</h3>
    <p>Asociación Juvenil Donify. Domicilio: Calle Nardo 42. Email: contacto@donify.org</p>

    <h3>2. Finalidad y Uso de Datos</h3>
    <p>Solo recopilamos los datos personales mínimos necesarios para:</p>
    <ul>
      <li>Gestionar tu cuenta de socio, votos y suscripción.</li>
      <li>Tramitar donaciones a través de Stripe (procesador de pagos seguro).</li>
      <li>Cumplir con obligaciones legales, como la emisión de certificados fiscales de donación.</li>
    </ul>

    <h3>3. Legitimación</h3>
    <p>El tratamiento de tus datos se basa en la ejecución del contrato de suscripción y en el cumplimiento de obligaciones legales de transparencia asociativa.</p>

    <h3>4. Destinatarios</h3>
    <p>No cedemos tus datos a terceros con fines comerciales. Solo compartimos datos con:</p>
    <ul>
      <li><strong>Stripe:</strong> Para procesar los cobros de forma segura.</li>
      <li><strong>Administración Tributaria:</strong> Para que puedas desgravar tu donación.</li>
    </ul>

    <h3>5. Tus Derechos</h3>
    <p>Tienes derecho a acceder, rectificar y suprimir tus datos en cualquier momento enviando un email a contacto@donify.org.</p>
  </div>
);

const CookiesContent = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Cookies</h1>
    <span className="text-xs text-gray-400 block mb-8">Información transparente sobre tu navegación</span>

    <p>En Donify utilizamos cookies para asegurar que nuestra plataforma funciona de forma correcta, segura y para mejorar tu experiencia de usuario.</p>

    <h3>1. ¿Qué es una cookie?</h3>
    <p>Una cookie es un pequeño archivo de texto que se almacena en tu navegador cuando visitas casi cualquier página web. Su utilidad es que la web sea capaz de recordar tu visita cuando vuelvas a navegar por esa página, como por ejemplo mantener tu sesión iniciada.</p>

    <h3>2. Tipos de cookies que utilizamos</h3>
    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 my-6 space-y-4">
      <div>
        <h4 className="font-bold text-gray-900 flex items-center gap-2">
          <Check size={16} className="text-primary" /> Cookies Técnicas (Necesarias)
        </h4>
        <p className="text-sm text-gray-600">Son esenciales para el funcionamiento del sitio. Permiten el inicio de sesión, la gestión de la seguridad y el proceso de votación. Sin ellas, Donify no puede funcionar.</p>
      </div>
      <div>
        <h4 className="font-bold text-gray-900 flex items-center gap-2">
          <Shield size={16} className="text-blue-500" /> Cookies de Seguridad (Stripe)
        </h4>
        <p className="text-sm text-gray-600">Nuestro procesador de pagos, Stripe, utiliza cookies para prevenir el fraude y asegurar que las transacciones son legítimas.</p>
      </div>
      <div>
        <h4 className="font-bold text-gray-900 flex items-center gap-2">
          <FileText size={16} className="text-gray-400" /> Cookies Analíticas
        </h4>
        <p className="text-sm text-gray-600">Utilizamos herramientas anónimas para saber cuánta gente nos visita y qué partes de la web resultan más útiles, sin identificar nunca al usuario individual.</p>
      </div>
    </div>

    <h3>3. Desactivación o eliminación de cookies</h3>
    <p>Puedes desactivar las cookies en cualquier momento configurando las opciones de tu navegador. Sin embargo, ten en cuenta que si desactivas las cookies técnicas, no podrás iniciar sesión ni participar en las votaciones de Donify.</p>

    <ul className="text-sm space-y-1">
      <li><strong>Chrome:</strong> Configuración - Privacidad y seguridad - Cookies.</li>
      <li><strong>Safari:</strong> Ajustes - Safari - Privacidad.</li>
      <li><strong>Firefox:</strong> Opciones - Privacidad y Seguridad - Cookies.</li>
    </ul>

    <h3>4. Consentimiento</h3>
    <p>Al navegar por Donify sin desactivar las cookies en tu navegador, aceptas el uso de las mismas para las finalidades descritas en esta política.</p>
  </div>
);

const TransparencyContent = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-2">Transparencia</h1>
    <span className="text-xs text-gray-400 block mb-8">Estatutos, Información Fiscal y Gobernanza • Última actualización: Febrero 2026</span>

    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">I. Estatutos de la Asociación</h2>

    <h3>1. Denominación y Naturaleza</h3>
    <p>Donify es una <strong>Asociación Juvenil sin ánimo de lucro</strong>, inscrita en el Registro Nacional de Asociaciones con el número [pendiente de inscripción]. Su constitución se rige por la Ley Orgánica 1/2002, de 22 de marzo, reguladora del Derecho de Asociación.</p>

    <h3>2. Objeto Social</h3>
    <p>La asociación tiene como fin exclusivo <strong>canalizar micro-donaciones de sus socios hacia organizaciones no gubernamentales</strong> (ONGs) verificadas, mediante un sistema de votación democrático y transparente.</p>
    <ul>
      <li>Promover la cultura de la solidaridad entre jóvenes y ciudadanos.</li>
      <li>Facilitar donaciones accesibles desde 0,99 € mediante tecnología digital.</li>
      <li>Garantizar la transparencia absoluta en el destino de los fondos.</li>
      <li>Empoderar a los donantes mediante un sistema de voto vinculante.</li>
    </ul>

    <h3>3. Domicilio Social</h3>
    <p>Calle Nardo 42, España. Correo electrónico: contacto@donify.org</p>

    <h3>4. Órganos de Gobierno</h3>
    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 my-6 space-y-4">
      <div>
        <h4 className="font-bold text-gray-900">Asamblea General</h4>
        <p className="text-sm text-gray-600">Órgano supremo de la asociación, compuesto por todos los socios. Se reúne al menos una vez al año de forma ordinaria para aprobar cuentas, memoria anual y presupuestos.</p>
      </div>
      <div>
        <h4 className="font-bold text-gray-900">Junta Directiva</h4>
        <p className="text-sm text-gray-600">Compuesta por Presidente, Secretario y Tesorero. Se encarga de la gestión ordinaria, la supervisión de la plataforma y la relación con las ONGs beneficiarias.</p>
      </div>
    </div>

    <h3>5. Régimen de los Socios</h3>
    <p>Los socios de Donify adquieren su condición al completar el proceso de suscripción. Todos los socios tienen derecho a voto, a recibir información sobre el destino de los fondos y a participar en las Asambleas Generales.</p>

    <h2 className="text-xl font-bold text-gray-900 mt-12 mb-4">II. Información Fiscal</h2>

    <h3>1. Régimen Fiscal Aplicable</h3>
    <p>Donify opera bajo el régimen fiscal de las <strong>entidades sin fines lucrativos</strong> conforme a la Ley 49/2002 de régimen fiscal de las entidades sin fines lucrativos y de los incentivos fiscales al mecenazgo.</p>

    <h3>2. Deducción Fiscal para Donantes</h3>
    <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 my-6">
      <h4 className="font-bold text-gray-900 mb-3">¿Puedo desgravarme las donaciones?</h4>
      <p className="text-sm text-gray-700 mb-3">Sí. Las donaciones realizadas a través de Donify pueden dar derecho a deducción fiscal en tu declaración de la renta (IRPF), conforme a la normativa vigente:</p>
      <ul className="text-sm text-gray-700 space-y-1">
        <li><strong>Primeros 250 €:</strong> deducción del 80%.</li>
        <li><strong>Resto:</strong> deducción del 40% (45% si se ha donado la misma cantidad o superior durante los 2 años anteriores).</li>
      </ul>
      <p className="text-xs text-gray-500 mt-3">* Porcentajes sujetos a la legislación fiscal vigente en cada ejercicio.</p>
    </div>

    <h3>3. CIF y Datos Registrales</h3>
    <p>CIF: [Pendiente de asignación]. Registro Nacional de Asociaciones: [Pendiente de inscripción]. Donify emitirá certificados de donación anuales a todos los socios que lo soliciten para su inclusión en la declaración de la renta.</p>

    <h3>4. Obligaciones Contables</h3>
    <p>Donify lleva contabilidad conforme al Plan General de Contabilidad adaptado a las entidades sin fines lucrativos. Las cuentas anuales son auditadas y están disponibles para consulta por cualquier socio.</p>

    <h2 className="text-xl font-bold text-gray-900 mt-12 mb-4">III. Transparencia de Tarifas</h2>

    <h3>1. Desglose de Costes</h3>
    <p>Donify deduce los costes de transacción antes de enviar el dinero a las ONGs. Estos costes no son beneficio para Donify, sino pagos a proveedores.</p>

    <div className="bg-gray-50 p-4 rounded-lg my-4 border border-gray-200">
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Stripe (Procesador):</strong> ~1.5% + 0.25€ por transacción.</li>
        <li><strong>Infraestructura:</strong> Coste marginal de servidores y base de datos.</li>
        <li><strong>ONGs:</strong> Reciben el 100% del restante.</li>
      </ul>
    </div>

    <h3>2. Seguridad de Fondos</h3>
    <p>Donify no toca el dinero directamente. Los fondos se almacenan en una cuenta "Connect" de Stripe y se liberan automáticamente a las cuentas bancarias verificadas de las ONGs tras el periodo de retención de seguridad (7-14 días).</p>

    <h2 className="text-xl font-bold text-gray-900 mt-12 mb-4">IV. Memoria Anual e Informes</h2>

    <h3>1. Memoria de Actividades</h3>
    <p>Donify publica anualmente una memoria de actividades que incluye:</p>
    <ul>
      <li>Total recaudado y distribución por ONG beneficiaria.</li>
      <li>Número de socios activos y evolución.</li>
      <li>Resultados de todas las votaciones del ejercicio.</li>
      <li>Gastos operativos desglosados.</li>
    </ul>

    <h3>2. Acceso a Documentación</h3>
    <p>Cualquier socio puede solicitar acceso a los siguientes documentos:</p>
    <ul>
      <li>Estatutos vigentes completos.</li>
      <li>Actas de la Asamblea General.</li>
      <li>Cuentas anuales auditadas.</li>
      <li>Certificado de inscripción registral.</li>
    </ul>
    <p className="text-sm text-gray-500 mt-4">Para solicitar cualquier documento, escríbenos a <strong>contacto@donify.org</strong>.</p>
  </div>
);
