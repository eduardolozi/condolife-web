interface LoginFormProps {
    onSubmit: () => Promise<void>
}

function LoginForm({onSubmit}: LoginFormProps) {
    return (
        <>
            <div>LoginForm works!</div>
        </>
    )
}

export {LoginForm}