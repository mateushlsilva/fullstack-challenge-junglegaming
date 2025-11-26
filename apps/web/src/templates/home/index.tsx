type HomeTemplateProps = {
    children: React.ReactNode
}

export function HomeTemplate({ children }: HomeTemplateProps) {
    return (
        <>
            { children }
        </>
    )
}