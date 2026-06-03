export default function LevelsPage() {
    return (
        <div className="p-8 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Curriculum Levels</h2>
            <div className="prose">
                <p>This system currently tracks Year 1 to Year 6.</p>
                <ul>
                    <li>Year 1: Introduction</li>
                    <li>Year 2: Intermediate</li>
                    <li>Year 3: Advanced</li>
                </ul>
                <p className="text-muted-foreground">Configuration is currently static.</p>
            </div>
        </div>
    )
}
