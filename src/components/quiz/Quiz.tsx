import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Sparkles, TrendingUp, MessageCircle } from "lucide-react";
import ProgressBar from "./ProgressBar";
import OptionButton from "./OptionButton";
import QuizButton from "./QuizButton";
import QuizInput from "./QuizInput";
import WaveDecoration from "./WaveDecoration";
import logo from "../assets/logo.png";

declare function fbq(...args: unknown[]): void;

const TOTAL_STEPS = 12;
const CRM_URL = "https://salesyscrm.vercel.app/api/public/leads";
const LEAD_CAPTURE_KEY = "braveo-principal-pixel-001";
const SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbyP-QbHP8R7abyDzqHiG3g-k8YmJhRrWk9rDeCpxEsPwROi82c5P1OfIzPO0paQa6Xo4Q/exec";
const WHATSAPP_NUMBER = "558694271798";

const slideVariants = {
  enter: { x: 60, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
};

type Answers = {
  faturamento: string;
  dor: string;
  desempenho: string;
  produtos: string[];
  mediaFaturamento: string;
  compraDistribuidora: string;
  estado: string;
  cidade: string;
  nomeFarmacia: string;
  usaRedes: string;
  redesSociais: string;
  nomeCompleto: string;
  email: string;
  cnpj: string;
  telefone: string;
};

function validarCNPJ(cnpj: string): boolean {
  const s = cnpj.replace(/\D/g, "");
  if (s.length !== 14) return false;
  if (/^(\d)\1+$/.test(s)) return false;

  const calc = (len: number) => {
    let sum = 0;
    let w = len - 7;
    for (let i = 0; i < len; i++) {
      sum += parseInt(s[i], 10) * w--;
      if (w < 2) w = 9;
    }
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };

  return calc(12) === parseInt(s[12], 10) && calc(13) === parseInt(s[13], 10);
}

function getUTMs() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source") || "",
    utm_medium: p.get("utm_medium") || "",
    utm_campaign: p.get("utm_campaign") || "",
    utm_content: p.get("utm_content") || "",
    utm_term: p.get("utm_term") || "",
  };
}

function getFbclid() {
  const p = new URLSearchParams(window.location.search);
  return p.get("fbclid") || "";
}

function normalizeState(value: string) {
  const normalized = value.trim().toUpperCase();
  return normalized === "PI" || normalized === "MA" ? normalized : "";
}



function updateQuizHash(step: number) {
  const nextHash = `#etapa-${step}`;

  if (window.location.hash === nextHash) {
    return;
  }

  const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
  window.history.replaceState(null, "", nextUrl);
}

function trackQuizStep(step: number) {
  try {
    updateQuizHash(step);

    if (typeof fbq !== "function") {
      return;
    }

    fbq("trackCustom", "QuizStepView", {
      quiz_name: "rio_piranhas_diagnostico",
      step_number: step,
      step_name: `etapa-${step}`,
      step_url: `${window.location.pathname}${window.location.search}#etapa-${step}`,
    });

    fbq("trackCustom", `Quiz_Etapa_${step}`, {
      quiz_name: "rio_piranhas_diagnostico",
      step_number: step,
    });
  } catch (error) {
    console.error("Meta Pixel step tracking error", error);
  }
}
function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

const Quiz = () => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({
    faturamento: "",
    dor: "",
    desempenho: "",
    produtos: [],
    mediaFaturamento: "",
    compraDistribuidora: "",
    estado: "",
    cidade: "",
    nomeFarmacia: "",
    usaRedes: "",
    redesSociais: "",
    nomeCompleto: "",
    email: "",
    cnpj: "",
    telefone: "",
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  useEffect(() => {
    trackQuizStep(step);
  }, [step]);

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const setAnswer = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const toggleProduct = (product: string) => {
    setAnswers((prev) => {
      const current = prev.produtos;

      if (product === "Não trabalho muito esses produtos") {
        return {
          ...prev,
          produtos: current.includes(product) ? [] : [product],
        };
      }

      const filtered = current.filter(
        (p) => p !== "Não trabalho muito esses produtos"
      );

      return {
        ...prev,
        produtos: filtered.includes(product)
          ? filtered.filter((p) => p !== product)
          : [...filtered, product],
      };
    });
  };

  const selectAndNext = (key: keyof Answers, value: string) => {
    setAnswer(key, value as Answers[keyof Answers]);
    setTimeout(next, 350);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col items-center text-center gap-6 py-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight">
              Descubra como aumentar o faturamento da sua farmácia{" "}
              <span className="text-primary">sem depender de medicamentos</span>
            </h1>

            <p className="text-muted-foreground text-base md:text-lg max-w-md">
              Identifique quais produtos de alto giro podem aumentar seu ticket
              médio e gerar vendas todos os dias
            </p>

            <div className="w-full mt-4">
              <QuizButton onClick={next} variant="cta">
                👉 Fazer diagnóstico gratuito
              </QuizButton>
            </div>
          </div>
        );

      case 2:
        return (
          <QuestionScreen
            emoji="🧩"
            question="Hoje, o que mais gera faturamento na sua farmácia?"
          >
            {[
              "Medicamentos",
              "Perfumaria e higiene",
              "Suplementos"
            ].map((opt) => (
              <OptionButton
                key={opt}
                label={opt}
                selected={answers.faturamento === opt}
                onClick={() => selectAndNext("faturamento", opt)}
              />
            ))}
          </QuestionScreen>
        );

      case 3:
        return (
          <QuestionScreen
            emoji="💡"
            question="Hoje, como está o desempenho da sua linha de higiene e beleza?"
          >
            {[
              "Vende muito bem",
              "Poderia melhorar",
              "Vendo pouco",
            ].map((opt) => (
              <OptionButton
                key={opt}
                label={opt}
                selected={answers.desempenho === opt}
                onClick={() => selectAndNext("desempenho", opt)}
              />
            ))}
          </QuestionScreen>
        );

      case 4:
        return (
          <QuestionScreen
            emoji="🧴"
            question="Quais dessas categorias você mais trabalha?"
            subtitle="(selecione todos que se aplicam)"
          >
            {[
              "Linha Infantil",
              "Higiene Bucal",
              "Capilar",
              "Cuidado com a Pele"
            ].map((opt) => (
              <OptionButton
                key={opt}
                label={opt}
                selected={answers.produtos.includes(opt)}
                onClick={() => toggleProduct(opt)}
                multiSelect
              />
            ))}

            <div className="mt-2">
              <QuizButton onClick={next} disabled={answers.produtos.length === 0}>
                Continuar
              </QuizButton>
            </div>
          </QuestionScreen>
        );

      case 5:
        return (
          <QuestionScreen
            emoji="💰"
            question="Qual a média de faturamento mensal da sua farmácia?"
          >
            {[
              "Até R$80 mil",
              "R$80 mil – R$100 mil",
              "R$100 mil – R$300 mil",
              "Acima de 300 mil"
            ].map((opt) => (
              <OptionButton
                key={opt}
                label={opt}
                selected={answers.mediaFaturamento === opt}
                onClick={() => selectAndNext("mediaFaturamento", opt)}
              />
            ))}
          </QuestionScreen>
        );

      case 6:
        return (
          <QuestionScreen emoji="📍" question="Onde fica sua farmácia?">
            <div className="flex flex-col gap-3">
              <select
                value={answers.estado}
                onChange={(e) => setAnswer("estado", normalizeState(e.target.value))}
                className="w-full p-4 rounded-lg border-2 border-border bg-card text-foreground font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="" disabled>
                  Selecione o estado
                </option>
                <option value="PI">Piauí (PI)</option>
                <option value="MA">Maranhão (MA)</option>
              </select>
              <QuizInput
                value={answers.cidade}
                onChange={(v) => setAnswer("cidade", v)}
                placeholder="Cidade"
              />
            </div>

            <div className="mt-2">
              <QuizButton
                onClick={next}
                disabled={!answers.estado || !answers.cidade}
              >
                Continuar
              </QuizButton>
            </div>
          </QuestionScreen>
        );

      case 7:
        return (
          <div className="flex flex-col items-center text-center gap-6 py-8">
            <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-secondary" />
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
              Perfeito! Já conseguimos identificar alguns pontos importantes no seu
              negócio.
            </h2>

            <p className="text-muted-foreground text-base max-w-md">
              Farmácias com perfil parecido com o seu estão aumentando o
              faturamento com produtos de alto giro, que vendem todos os dias e
              aumentam o ticket médio sem depender de receita.
            </p>

            <p className="text-foreground font-semibold text-base">
              Agora vou montar uma sugestão personalizada pra você 👇
            </p>

            <QuizButton onClick={next}>Continuar</QuizButton>
          </div>
        );

      case 8:
        return (
          <QuestionScreen emoji="🔐" question="Qual é o seu nome completo?">
            <QuizInput
              value={answers.nomeCompleto}
              onChange={(v) => setAnswer("nomeCompleto", v)}
              placeholder="Nome e sobrenome"
            />

            <div className="mt-2">
              <QuizButton onClick={next} disabled={!answers.nomeCompleto}>
                Continuar
              </QuizButton>
            </div>
          </QuestionScreen>
        );

      case 9:
        return (
          <QuestionScreen emoji="📧" question="Qual é o seu melhor e-mail?">
            <QuizInput
              value={answers.email}
              onChange={(v) => setAnswer("email", v.trim().toLowerCase())}
              placeholder="seu@email.com"
              type="email"
            />

            {answers.email && !isValidEmail(answers.email) ? (
              <p className="text-sm text-destructive">
                Informe um e-mail válido.
              </p>
            ) : null}

            <div className="mt-2">
              <QuizButton
                onClick={next}
                disabled={!isValidEmail(answers.email)}
              >
                Continuar
              </QuizButton>
            </div>
          </QuestionScreen>
        );

      case 10:
        return (
          <QuestionScreen emoji="🏢" question="Qual é o CNPJ da sua farmácia?">
            <QuizInput
              value={answers.cnpj}
              onChange={(v) => setAnswer("cnpj", v)}
              placeholder="00.000.000/0000-00"
              mask="cnpj"
            />

            <div className="mt-2">
              <QuizButton
                onClick={next}
                disabled={!validarCNPJ(answers.cnpj)}
              >
                Continuar
              </QuizButton>
            </div>
          </QuestionScreen>
        );

      case 11:
        return (
          <QuestionScreen emoji="📲" question="Seu WhatsApp">
            <QuizInput
              value={answers.telefone}
              onChange={(v) => setAnswer("telefone", v)}
              placeholder="(00) 00000-0000"
              mask="phone"
            />

            <div className="mt-2">
              <QuizButton
                onClick={next}
                disabled={!answers.telefone || answers.telefone.length < 14}
              >
                Continuar
              </QuizButton>
            </div>
          </QuestionScreen>
        );

      case 12:
        return (
          <div className="flex flex-col items-center text-center gap-6 py-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
              Com base nas suas respostas, existe uma{" "}
              <span className="text-primary">oportunidade clara</span> de aumentar
              seu faturamento com produtos de alto giro e melhor margem.
            </h2>

            <p className="text-muted-foreground text-base max-w-md">
              Agora você pode falar direto com um especialista e ver quais produtos
              fazem mais sentido pro seu negócio.
            </p>

            <QuizButton
              onClick={async () => {
                if (isSubmittingLead) {
                  return;
                }

                setIsSubmittingLead(true);

                const utms = getUTMs();
                const fbclid = getFbclid();
                const normalizedPhone = answers.telefone.replace(/\D/g, "");
                const normalizedCnpj = answers.cnpj.replace(/\D/g, "");
                const normalizedState = normalizeState(answers.estado);

                try {
                  fbq("track", "Lead");
                } catch (_) {
                  // pixel pode não estar carregado
                }

                const crmPromise = fetch(CRM_URL, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    leadCaptureKey: LEAD_CAPTURE_KEY,
                    name: answers.nomeCompleto,
                    phone: normalizedPhone,
                    document: normalizedCnpj,
                    documentType: "cnpj",
                    state: normalizedState,
                    addressLine: answers.cidade,
                    utm_source: utms.utm_source,
                    utm_medium: utms.utm_medium,
                    utm_campaign: utms.utm_campaign,
                    utm_content: utms.utm_content,
                    utm_term: utms.utm_term,
                    fbclid,
                  }),
                })
                  .then(async (response) => {
                    const crmData = await response.json().catch(() => null);

                    if (!response.ok) {
                      console.error("CRM lead capture failed", {
                        status: response.status,
                        response: crmData,
                      });
                    } else if (crmData?.duplicate) {
                      console.warn("CRM lead already exists", crmData);
                    } else {
                      console.info("CRM lead created successfully", crmData);
                    }
                  })
                  .catch((error) => {
                    console.error("CRM lead capture request error", error);
                  });

                const sheetsPayload = JSON.stringify({
                  nomeCompleto: answers.nomeCompleto,
                  email: answers.email,
                  telefone: answers.telefone,
                  documento: normalizedCnpj,
                  tipoDocumento: "cnpj",
                  estado: normalizedState,
                  cidade: answers.cidade,
                  faturamento: answers.faturamento,
                  desempenho: answers.desempenho,
                  produtos: answers.produtos,
                  mediaFaturamento: answers.mediaFaturamento,
                  fbclid,
                  ...utms,
                });

                const sheetsPromise = new Promise<void>((resolve) => {
                  const sent = navigator.sendBeacon(
                    SHEETS_URL,
                    new Blob([sheetsPayload], { type: "text/plain" })
                  );
                  if (!sent) {
                    console.warn("sendBeacon falhou, tentando fetch como fallback");
                    fetch(SHEETS_URL, {
                      method: "POST",
                      mode: "no-cors",
                      headers: { "Content-Type": "text/plain" },
                      body: sheetsPayload,
                    }).catch((error) => {
                      console.error("Sheets request error", error);
                    }).finally(resolve);
                  } else {
                    resolve();
                  }
                });

                await Promise.allSettled([crmPromise, sheetsPromise]);

                const phone = WHATSAPP_NUMBER;
                const msg = encodeURIComponent(
                  `Olá! Fiz o diagnóstico no site e gostaria de falar com um especialista.\n\n` +
                    `Nome: ${answers.nomeCompleto}\n` +
                    `Farmácia: ${answers.nomeFarmacia}\n` +
                    `Telefone: ${answers.telefone}\n` +
                    `Cidade/Estado: ${answers.cidade} - ${normalizedState}\n` +
                    `CNPJ: ${answers.cnpj}`
                );
                window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
                setIsSubmittingLead(false);
              }}
              disabled={isSubmittingLead}
              variant="cta"
            >
              <span className="flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {isSubmittingLead
                  ? "Enviando seus dados..."
                  : "Falar com um especialista agora"}
              </span>
            </QuizButton>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <WaveDecoration />

      <div className="w-full bg-primary py-5 px-6 flex items-center justify-between relative shadow-md">
        <div className="w-[60px] flex justify-start">
          {step > 1 && (
            <button
              onClick={prev}
              className="text-primary-foreground text-sm font-medium"
              type="button"
            >
              ← Voltar
            </button>
          )}
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
          <img src={logo} alt="RIO PIRANHAS" className="h-7 w-auto" />
          <span className="text-primary-foreground font-bold text-lg tracking-wide whitespace-nowrap">
            RIO PIRANHAS
          </span>
        </div>

        <div className="w-[60px]" />
      </div>

      {step > 1 && step < TOTAL_STEPS && (
        <ProgressBar current={step - 1} total={TOTAL_STEPS - 1} />
      )}
      <div className="flex-1 flex items-start justify-center px-4 py-6">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const QuestionScreen = ({
  emoji,
  question,
  subtitle,
  children,
}: {
  emoji: string;
  question: string;
  subtitle?: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-start gap-3">
      <span className="text-2xl">{emoji}</span>

      <div>
        <h2 className="text-lg md:text-xl font-bold text-foreground">
          {question}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </div>

    <div className="flex flex-col gap-3 mt-2">{children}</div>
  </div>
);

export default Quiz;
