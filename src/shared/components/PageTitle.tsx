import { useEffect, useState, type ReactNode } from "react"
import { Dialog } from "primereact/dialog"

interface PageTitleProps {
  text: string
  infoContent?: ReactNode
}

export const PageTitle = ({ text, infoContent }: PageTitleProps) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)")
    const updateScreenSize = () => setIsLargeScreen(mediaQuery.matches)

    updateScreenSize()
    mediaQuery.addEventListener("change", updateScreenSize)

    return () => mediaQuery.removeEventListener("change", updateScreenSize)
  }, [])

  return (
    <div className="flex items-center gap-2 mb-3 mt-4">
      <p className="text-center md:text-start font-bold text-xl md:text-2xl text-emerald-950 m-0">
        {text}
      </p>

      {infoContent && (
        <>
          <button
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 md:w-9 md:h-9 cursor-pointer p-0 bg-transparent border-0 rounded-full hover:bg-yellow-100/60 focus-visible:outline focus-visible:outline-yellow-500/70"
            aria-label="Informacoes sobre esta etapa"
            onClick={() => setIsInfoVisible(true)}
          >
            <i className="pi pi-info-circle text-yellow-500" style={{ fontSize: "1.1rem" }} />
          </button>

          <Dialog
            visible={isInfoVisible}
            onHide={() => setIsInfoVisible(false)}
            modal
            dismissableMask
            draggable={false}
            resizable={false}
            closeOnEscape
            showHeader={false}
            position={isLargeScreen ? "right" : "bottom"}
            className={`page-title-info-dialog ${isLargeScreen ? "page-title-info-dialog--side" : "page-title-info-dialog--bottom"}`}
            pt={{
              mask: { className: "page-title-info-dialog-mask" },
              content: { className: "page-title-info-dialog__content" },
            }}
          >
            {infoContent}
          </Dialog>
        </>
      )}
    </div>
  )
}
