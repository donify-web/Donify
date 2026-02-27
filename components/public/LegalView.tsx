
import React from 'react';
import { PageView } from '../../types';
import { Shield, Check, FileText, Lock, Scale, ShieldCheck, Building2, Euro } from 'lucide-react';

interface LegalViewProps {
  onNavigate: (view: PageView) => void;
  initialTab?: Tab;
}

type Tab = 'privacy' | 'terms' | 'transparency' | 'cookies';

const PAGE_META: Record<Tab, { icon: React.ReactNode; title: string; subtitle: string; badge: string; summary: string }> = {
  terms: {
    icon: <Scale size={28} />,
    title: 'Términos y Condiciones',
    subtitle: 'Última actualización: Octubre 2024',
    badge: 'Legal',
    summary: 'Al donar, aceptas que el voto es vinculante y el dinero no es reembolsable. El 100% del beneficio neto va a las causas elegidas.',
  },
  privacy: {
    icon: <Shield size={28} />,
    title: 'Política de Privacidad',
    subtitle: 'RGPD Compliant • Última actualización: Octubre 2024',
    badge: 'Privacidad',
    summary: 'Tus datos son sagrados. Solo los usamos para procesar pagos y cumplir la ley. Jamás los vendemos.',
  },
  cookies: {
    icon: <Lock size={28} />,
    title: 'Política de Cookies',
    subtitle: 'Información transparente sobre tu navegación',
    badge: 'Cookies',
    summary: 'Solo usamos las cookies estrictamente necesarias para que la web funcione y sea segura.',
  },
  transparency: {
    icon: <FileText size={28} />,
    title: 'Transparencia',
    subtitle: 'Estatutos, Información Fiscal y Gobernanza • Última actualización: Febrero 2026',
    badge: 'Transparencia',
    summary: 'Somos una asociación sin ánimo de lucro. Cobramos solo lo necesario para cubrir costes operativos y pasarelas de pago.',
  },
};

export default function LegalView({ initialTab = 'terms' }: LegalViewProps) {
  const meta = PAGE_META[initialTab];

  const content = {
    terms: <TermsContent />,
    privacy: <PrivacyContent />,
    cookies: <CookiesContent />,
    transparency: <TransparencyContent />,
  };

  return (
    <div className="min-h-screen bg-bgMain font-sans text-textMain animate-in fade-in duration-500">

      {/* HERO */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-white to-bgMain">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 text-sm font-semibold text-primary mb-2">
            {meta.icon}
            {meta.badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
            {meta.title}
          </h1>
          <p className="text-gray-500 text-sm">{meta.subtitle}</p>
        </div>
      </section>

      {/* SUMMARY CALLOUT */}
      <section className="px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0 text-primary mt-0.5">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">En Resumen</p>
              <p className="text-gray-700 leading-relaxed">{meta.summary}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 pb-32">
        <div className="max-w-3xl mx-auto space-y-6">
          {content[initialTab]}
        </div>
      </section>

    </div>
  );
}

/* ─── SHARED HELPERS ─────────────────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-8 py-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      <div className="px-8 py-6 text-gray-600 leading-relaxed space-y-3 text-sm">
        {children}
      </div>
    </div>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 w-4 h-4 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
        <Check size={10} className="text-primary" />
      </span>
      <span>{children}</span>
    </div>
  );
}

/* ─── TERMS ─────────────────────────────────────────────────────────────── */

const TermsContent = () => (
  <>
    <Section title="1. Naturaleza de las donaciones">
      <p>Todas las donaciones realizadas son voluntarias y no reembolsables, bajo ninguna circunstancia. Una vez efectuado el aporte y cerrado el ciclo de votación, los fondos se transfieren automáticamente.</p>
    </Section>

    <Section title="2. Destino y Reparto">
      <p>El total recaudado se distribuye exclusivamente entre las tres ONGs más votadas:</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { pos: '🥇 1.er lugar', pct: '50%' },
          { pos: '🥈 2.º lugar', pct: '30%' },
          { pos: '🥉 3.er lugar', pct: '20%' },
        ].map(({ pos, pct }) => (
          <div key={pos} className="bg-bgMain rounded-xl p-4 text-center border border-gray-100">
            <div className="text-2xl font-black text-gray-900">{pct}</div>
            <div className="text-xs text-gray-500 mt-1">{pos}</div>
          </div>
        ))}
      </div>
    </Section>

    <Section title="3. Sistema de Votación">
      <p>Los resultados dependen única y exclusivamente del sistema de votación habilitado. Donify no garantiza que una ONG específica gane. En caso de detección de fraude (bots, multicuentas), nos reservamos el derecho de anular esos votos.</p>
    </Section>

    <Section title="4. Tratamiento Fiscal">
      <p>Las donaciones realizadas a través de la plataforma pueden dar derecho a deducción fiscal conforme a la legislación española. El usuario es responsable de proporcionar sus datos fiscales correctos en su perfil.</p>
    </Section>
  </>
);

/* ─── PRIVACY ───────────────────────────────────────────────────────────── */

const PrivacyContent = () => (
  <>
    <Section title="1. Responsable del Tratamiento">
      <p>Asociación Juvenil Donify. Domicilio: Calle Nardo 42, España. Email: <strong>contacto@donify.org</strong></p>
    </Section>

    <Section title="2. Finalidad y Uso de Datos">
      <p>Solo recopilamos los datos personales mínimos necesarios para:</p>
      <div className="mt-3 space-y-2">
        <Li>Gestionar tu cuenta de socio, votos y suscripción.</Li>
        <Li>Tramitar donaciones a través de Stripe (procesador de pagos seguro).</Li>
        <Li>Cumplir con obligaciones legales, como la emisión de certificados fiscales de donación.</Li>
      </div>
    </Section>

    <Section title="3. Legitimación">
      <p>El tratamiento de tus datos se basa en la ejecución del contrato de suscripción y en el cumplimiento de obligaciones legales de transparencia asociativa.</p>
    </Section>

    <Section title="4. Destinatarios">
      <p>No cedemos tus datos a terceros con fines comerciales. Solo compartimos datos con:</p>
      <div className="mt-4">
        <div className="bg-bgMain rounded-xl p-4 border border-gray-100">
          <p className="font-bold text-gray-900 text-sm mb-1">Stripe</p>
          <p className="text-xs text-gray-500">Para procesar los cobros de forma segura.</p>
        </div>
      </div>
    </Section>

    <Section title="5. Tus Derechos">
      <p>Tienes derecho a acceder, rectificar y suprimir tus datos en cualquier momento enviando un email a <strong>contacto@donify.org</strong>.</p>
    </Section>
  </>
);

/* ─── COOKIES ───────────────────────────────────────────────────────────── */

const CookiesContent = () => (
  <>
    <Section title="¿Qué es una cookie?">
      <p>Una cookie es un pequeño archivo de texto que se almacena en tu navegador cuando visitas una página web. Su utilidad es que la web pueda recordar tu visita cuando vuelvas a navegar, como por ejemplo mantener tu sesión iniciada.</p>
    </Section>

    <Section title="Tipos de cookies que utilizamos">
      <div className="space-y-4">
        {[
          {
            icon: <Check size={14} className="text-primary" />,
            bg: 'bg-primary/10',
            name: 'Cookies Técnicas (Necesarias)',
            desc: 'Esenciales para el funcionamiento del sitio. Sin ellas, Donify no puede funcionar correctamente.'
          },
          {
            icon: <Shield size={14} className="text-blue-500" />,
            bg: 'bg-blue-50',
            name: 'Cookies de Seguridad (Stripe)',
            desc: 'Nuestro procesador de pagos usa cookies para prevenir el fraude en las transacciones.'
          },
          {
            icon: <FileText size={14} className="text-gray-400" />,
            bg: 'bg-gray-100',
            name: 'Cookies Analíticas',
            desc: 'Herramientas anónimas para saber cuánta gente nos visita, sin identificar al usuario individual.'
          },
        ].map(({ icon, bg, name, desc }) => (
          <div key={name} className="flex items-start gap-3 p-4 bg-bgMain rounded-xl border border-gray-100">
            <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
              {icon}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Desactivación o eliminación de cookies">
      <p>Puedes desactivar las cookies en cualquier momento desde tu navegador. Ten en cuenta que desactivar las cookies técnicas impedirá el inicio de sesión y la participación en votaciones.</p>
      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        {['Chrome', 'Safari', 'Firefox'].map(b => (
          <div key={b} className="bg-bgMain rounded-xl p-3 border border-gray-100 text-center">
            <p className="font-bold text-gray-900 text-sm">{b}</p>
            <p className="text-xs text-gray-500 mt-1">Configuración → Privacidad</p>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Consentimiento">
      <p>Al navegar por Donify sin desactivar las cookies en tu navegador, aceptas su uso para las finalidades descritas en esta política.</p>
    </Section>
  </>
);

/* ─── TRANSPARENCY ──────────────────────────────────────────────────────── */

const TransparencyContent = () => (
  <>
    {/* Statutes */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
          <Building2 size={16} />
        </div>
        <h2 className="text-lg font-bold text-gray-900">I. Estatutos de la Asociación</h2>
      </div>
      <div className="px-8 py-6 space-y-6 text-sm text-gray-600 leading-relaxed">
        <div>
          <h3 className="font-bold text-gray-900 mb-1">1. Denominación y Naturaleza</h3>
          <p>Donify es una <strong>Asociación Juvenil sin ánimo de lucro</strong>, inscrita en el Registro Autonómico de Asociaciones de Canarias con número <strong>28230</strong> (G1 / S1 / 28230-26 / GC). Su constitución se rige por la Ley Orgánica 1/2002 reguladora del Derecho de Asociación.</p>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-2">2. Objeto Social</h3>
          <p className="mb-3">La asociación tiene como fin exclusivo canalizar micro-donaciones hacia ONGs verificadas, mediante votación democrática y transparente.</p>
          <div className="space-y-2">
            <Li>Promover la cultura de la solidaridad entre jóvenes y ciudadanos.</Li>
            <Li>Facilitar donaciones accesibles desde 0,99 € mediante tecnología digital.</Li>
            <Li>Garantizar la transparencia absoluta en el destino de los fondos.</Li>
            <Li>Empoderar a los donantes mediante un sistema de voto vinculante.</Li>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-2">3. Domicilio Social</h3>
          <p>Calle Nardo 42, España · <strong>contacto@donify.org</strong></p>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-3">4. Órganos de Gobierno</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-bgMain rounded-xl p-4 border border-gray-100">
              <p className="font-bold text-gray-900 text-sm mb-1">Asamblea General</p>
              <p className="text-xs text-gray-500">Órgano supremo, compuesto por todos los socios. Se reúne al menos una vez al año para aprobar cuentas y presupuestos.</p>
            </div>
            <div className="bg-bgMain rounded-xl p-4 border border-gray-100">
              <p className="font-bold text-gray-900 text-sm mb-1">Junta Directiva</p>
              <p className="text-xs text-gray-500">Compuesta por Presidente, Secretario y Tesorero. Gestiona la plataforma y la relación con las ONGs.</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-1">5. Régimen de los Socios</h3>
          <p>Los socios adquieren su condición al completar el proceso de suscripción. Todos tienen derecho a voto, a información sobre el destino de los fondos y a participar en las Asambleas.</p>
        </div>
      </div>
    </div>

    {/* Fiscal */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
          <Euro size={16} />
        </div>
        <h2 className="text-lg font-bold text-gray-900">II. Información Fiscal</h2>
      </div>
      <div className="px-8 py-6 space-y-6 text-sm text-gray-600 leading-relaxed">
        <div>
          <h3 className="font-bold text-gray-900 mb-1">1. Régimen Fiscal</h3>
          <p>Donify opera bajo el régimen de <strong>entidades sin fines lucrativos</strong> conforme a la Ley 49/2002 de régimen fiscal de las entidades sin fines lucrativos y los incentivos fiscales al mecenazgo.</p>
        </div>


        <div>
          <h3 className="font-bold text-gray-900 mb-1">3. NIF y Datos Registrales</h3>
          <div className="space-y-2 mt-2">
            <div className="flex flex-wrap gap-3">
              <div className="bg-bgMain rounded-xl px-4 py-3 border border-gray-100 flex-1 min-w-[200px]">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-0.5">NIF</p>
                <p className="text-gray-900 font-semibold">G26733998</p>
              </div>
              <div className="bg-bgMain rounded-xl px-4 py-3 border border-gray-100 flex-1 min-w-[200px]">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-0.5">Registro Autonómico de Canarias</p>
                <p className="text-gray-900 font-semibold">G1 / S1 / 28230-26 / GC</p>
              </div>
            </div>
            <p className="text-gray-500 mt-2">Donify emitirá certificados de donación anuales a todos los socios que lo soliciten.</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-1">4. Obligaciones Contables</h3>
          <p>Donify lleva contabilidad conforme al Plan General de Contabilidad para entidades sin fines lucrativos. Las cuentas anuales son auditadas y están disponibles para cualquier socio.</p>
        </div>
      </div>
    </div>

    {/* Fee transparency */}
    <Section title="III. Transparencia de Tarifas">
      <p>Donify deduce únicamente los costes de transacción antes de enviar el dinero a las ONGs. No son beneficio para Donify.</p>
      <div className="mt-4 space-y-2">
        <Li><strong>Stripe (Procesador):</strong> ~1.5% + 0.25€ por transacción.</Li>
        <Li><strong>Infraestructura:</strong> Coste marginal de servidores y base de datos.</Li>
        <Li><strong>ONGs:</strong> Reciben el 100% del restante.</Li>
      </div>
      <div className="mt-4 p-4 bg-bgMain rounded-xl border border-gray-100">
        <p className="text-xs font-medium text-gray-500">Los fondos se almacenan en una cuenta "Connect" de Stripe y se liberan automáticamente a las cuentas bancarias verificadas de las ONGs tras el periodo de retención de seguridad (7-14 días). Donify no toca el dinero directamente.</p>
      </div>
    </Section>

    {/* Annual reports */}
    <Section title="IV. Memoria Anual e Informes">
      <p>Donify publica anualmente una memoria de actividades con:</p>
      <div className="mt-3 space-y-2">
        <Li>Total recaudado y distribución por ONG beneficiaria.</Li>
        <Li>Número de socios activos y evolución.</Li>
        <Li>Resultados de todas las votaciones del ejercicio.</Li>
        <Li>Gastos operativos desglosados.</Li>
      </div>
      <div className="mt-5 p-4 bg-bgMain rounded-xl border border-gray-100">
        <p className="font-semibold text-gray-900 text-sm mb-1">Solicitar documentación</p>
        <p className="text-xs text-gray-500">Cualquier socio puede solicitar acceso a los estatutos vigentes, actas de la Asamblea General, cuentas auditadas o certificado de inscripción escribiendo a <strong>contacto@donify.org</strong>.</p>
      </div>
    </Section>
  </>
);
