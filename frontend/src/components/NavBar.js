import React from 'react'
import {Link} from 'react-router-dom'

function NavBar() {
    return (
        <nav className="w-full h-16 bg-background border-b border-border px-4 flex items-center">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex-1">
                    <h1 className="text-xl font-semibold text-foreground">
                        Student Counter
                    </h1>
                </div>

                <div className="flex gap-6">
                    <Link key='twocam'
                        to='/'
                        className=
                        "text-sm font-medium transition-colors hover:text-primary"> Two Cam View
                    </Link>
                    <Link key='stitched'
                        to='/stitched'
                        className=
                        "text-sm font-medium transition-colors hover:text-primary"> Stitched Images
                    </Link>
                    <Link key='onecam'
                        to='/onecam'
                        className=
                        "text-sm font-medium transition-colors hover:text-primary"> One Cam View
                    </Link>
                </div>

            </div>
        </nav>
    )
}

export default NavBar;