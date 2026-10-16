const leadership = [
    {
        name: 'Ansh',
        role: 'Team Lead',
        avatar: '/ansh.jpeg',
    }
]

const engineering = [
    {
        name: 'Areeb',
        role: 'Technical Lead',
        avatar: '/areeb.jpeg',
    },
    {
        name: 'Jatin',
        role: 'Development Lead',
        avatar: '/Jatinbhaiya.jpeg',
    },
    {
        name: 'Ayan',
        role: 'Design Lead',
        avatar: '/ayan.jpeg',
    }
]

const operations = [
    {
        name: 'Kashni',
        role: 'Content Lead',
        avatar: '/Kashni.jpeg',
    },
    {
        name: 'Saksham',
        role: 'Marketing Lead',
        avatar: '/saksham.jpeg',
    }
]

export default function TeamSection() {
    const TeamMembers = ({ members }: { members: typeof leadership }) => (
        <div className="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-4">
            {members.map((member, index) => (
                <div key={index}>
                    <div className="bg-background size-20 rounded-full border p-0.5 shadow shadow-zinc-950/5">
                        <img 
                            className="aspect-square rounded-full object-cover" 
                            src={member.avatar} 
                            alt={member.name} 
                            height="460" 
                            width="460" 
                            loading="lazy" 
                        />
                    </div>
                    <span className="mt-2 block text-sm font-medium">{member.name}</span>
                    <span className="text-muted-foreground block text-xs">{member.role}</span>
                </div>
            ))}
        </div>
    )

    return (
        <section className="py-12 md:py-32 bg-black text-white">
            <div className="mx-auto max-w-3xl px-8 lg:px-0">
                <h2 className="mb-8 text-4xl font-bold md:mb-16 lg:text-5xl">Our Team</h2>

                <div>
                    <h3 className="mb-6 text-lg font-medium text-gray-200">Leadership</h3>
                    <TeamMembers members={leadership} />
                </div>

                <div className="mt-6">
                    <h3 className="mb-6 text-lg font-medium text-gray-200">Engineering</h3>
                    <TeamMembers members={engineering} />
                </div>

                <div className="mt-6">
                    <h3 className="mb-6 text-lg font-medium text-gray-200">Operations</h3>
                    <TeamMembers members={operations} />
                </div>
            </div>
        </section>
    )
}
