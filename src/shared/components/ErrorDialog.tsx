import { Dialog } from "primereact/dialog"
import  { ApiError } from "../types/ApiError"
import { Button } from "primereact/button"

export interface ErrorDialogProps{
    visible: boolean,
    error: ApiError | null,
    onHide: () => void
}

export const ErrorDialog = ({visible, error, onHide}: ErrorDialogProps) => {
    const hasDetails = !!error?.errors?.length

    const header = (
        <div className="error-dialog__header-content">
            <span className="error-dialog__icon pi pi-exclamation-triangle" aria-hidden="true" />
            <div className="error-dialog__titles">
                <p className="error-dialog__title">Algo deu errado</p>
                <p className="error-dialog__subtitle">Confira os detalhes abaixo e tente novamente.</p>
            </div>
        </div>
    )

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header={header}
            modal
            draggable={false}
            resizable={false}
            closable={false}
            className="error-dialog"
            style={{ width: "34rem", maxWidth: "94vw" }}
            breakpoints={{ "960px": "76vw", "640px": "94vw" }}
        >
            <div className="error-dialog__body">
                <p className="error-dialog__message">{error?.message ?? "Erro inesperado."}</p>

                {hasDetails && (
                    <div className="error-dialog__details" role="list" aria-label="Detalhes do erro">
                        {error.errors?.map((errorDetail, index) => (
                            <p className="error-dialog__detail-item" key={`${errorDetail}-${index}`} role="listitem">
                                {errorDetail}
                            </p>
                        ))}
                    </div>
                )}

                <div className="error-dialog__actions mt-3">
                    <Button label="Fechar" outlined severity="secondary" onClick={onHide} className="error-dialog__close-button" />
                </div>
            </div>
        </Dialog>
    )
}
