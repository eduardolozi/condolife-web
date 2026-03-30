import { useMemo, useState } from "react"
import { Accordion, AccordionTab } from "primereact/accordion"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Message } from "primereact/message"
import { Steps } from "primereact/steps"
import { Tag } from "primereact/tag"
import { Divider } from "primereact/divider"

interface CsvStep {
  label: string
  header: string
  hint: string
  accepted: string
  restriction: string
  required: boolean
}

interface ResidentsCsvHelpProps {
  variant?: "side" | "sheet"
}

const csvSteps: CsvStep[] = [
  {
    label: "Nome",
    header: "Nome Completo do Proprietario",
    hint: "Preencha o nome completo com atencao. Esse campo ajuda no sucesso do cadastro.",
    accepted: "Nome e sobrenome completos.",
    restriction: "Evite abreviações.",
    required: true
  },
  {
    label: "CPF",
    header: "CPF do Proprietario",
    hint: "O CPF identifica a pessoa de forma única no momento da validação.",
    accepted: "700.402.199-90 ou 70040219990.",
    restriction: "Deve conter 11 dígitos válidos.",
    required: true
  },
  {
    label: "Apto",
    header: "Número do apartamento",
    hint: "Informe somente a unidade para direcionar corretamente o vínculo.",
    accepted: "101, 502, 1203.",
    restriction: "Não inclua bloco, torre ou texto extra.",
    required: true
  },
  {
    label: "Bloco",
    header: "Bloco (opcional)",
    hint: "Use quando seu condomínio trabalhar com blocos ou torres.",
    accepted: "Torre A, Bloco 2.",
    restriction: "Pode ficar vazio em condomínio com torre única.",
    required: false
  }
]

export const ResidentsCsvHelp = ({ variant = "side" }: ResidentsCsvHelpProps) => {
  const [activeStep, setActiveStep] = useState(0)
  const currentStep = csvSteps[activeStep]
  const isSheet = variant === "sheet"

  const stepItems = useMemo(
    () => csvSteps.map((step) => ({ label: step.label })),
    []
  )

  const content = (
    <>
      <div className="flex items-start gap-2">
        <i className="pi pi-info-circle text-emerald-700 mt-1" />
        <div>
          <p className="m-0 font-semibold text-emerald-950">Como montar a planilha</p>
          <p className="m-0 mt-1 text-sm text-gray-600">
            Guia rapido, visual e por etapas.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Steps
          model={stepItems}
          activeIndex={activeStep}
          readOnly={false}
          onSelect={(event) => setActiveStep(event.index)}
          className="text-sm"
        />
      </div>

      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="m-0 text-sm font-semibold text-gray-900">{currentStep.header}</p>
          <Tag
            value={currentStep.required ? "Obrigatorio" : "Opcional"}
            severity={currentStep.required ? "warning" : "info"}
          />
        </div>

        <p className="m-0 mt-2 text-sm text-gray-700">{currentStep.hint}</p>

        <Message
          className="mt-3 w-full"
          severity="success"
          text={`Formato aceito: ${currentStep.accepted}`}
        />

        <Message
          className="mt-2 w-full"
          severity="warn"
          text={`Atencao: ${currentStep.restriction}`}
        />

        <div className="mt-3 flex gap-2">
          <Button
            type="button"
            label="Anterior"
            severity="secondary"
            outlined
            size="small"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((value) => Math.max(0, value - 1))}
            className="flex-1"
          />
          <Button
            type="button"
            label={activeStep === csvSteps.length - 1 ? "Concluido" : "Proximo"}
            size="small"
            disabled={activeStep === csvSteps.length - 1}
            onClick={() => setActiveStep((value) => Math.min(csvSteps.length - 1, value + 1))}
            className="flex-1"
          />
        </div>
      </div>

      <Divider className="my-4" />

      <Accordion>
        <AccordionTab header="Cabecalho esperado">
          <p className="m-0 text-sm leading-relaxed">
            Nome Completo do Proprietario ; CPF do Proprietario ; Numero do apartamento ; Bloco (opcional)
          </p>
        </AccordionTab>
        <AccordionTab header="Regras gerais">
          <ul className="m-0 pl-5 text-sm leading-relaxed">
            <li>Use ponto e virgula (;) para separar as colunas.</li>
            <li>CPF pode ser com pontuacao ou apenas digitos.</li>
            <li>Revise nome completo e numero do apartamento antes do envio.</li>
          </ul>
        </AccordionTab>
      </Accordion>
    </>
  )

  if (isSheet) {
    return <div className="residents-csv-help residents-csv-help--sheet">{content}</div>
  }

  return (
    <Card className="residents-csv-help residents-csv-help--side h-fit border border-emerald-700/10 shadow-sm">
      {content}
    </Card>
  )
}
