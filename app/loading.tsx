import { CreativeLoader } from "@/components/ui/loader";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <CreativeLoader size="xl" />
                <p className="text-muted-foreground animate-pulse font-medium tracking-wide">
                    Loading...
                </p>
            </div>
        </div>
    );
}
