export const  Branding =()=>{
    return <>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">♪</span>
          </div>
          <span className="font-semibold text-foreground hidden sm:inline">Music Room</span>
        </div>
    </>
}