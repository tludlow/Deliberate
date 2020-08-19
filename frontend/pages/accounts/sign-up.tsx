import Layout from '@/components/layout'

//Design inspiration: https://dribbble.com/shots/9712645-StartGlobal-Onboarding
export default function SignUp() {
    return (
        <Layout title="Sign up - Deliberate" contained>
            <div className="max-w-5xl mx-auto mt-4 grid grid-cols-10 gap-4">
                <div className="col-span-3 p-6 border border-gray-100">
                    <ul>
                        <li className="flex items-center">
                            <NumberedBadge num={1} active={true} /> Information
                        </li>
                        <li className="flex items-center">
                            <NumberedBadge num={2} active={false} /> Team Type
                        </li>
                    </ul>
                </div>
                <div className="col-span-7 p-6 bg-gray-200"></div>
            </div>
        </Layout>
    )
}

type NumberedBadgeProps = {
    num: number,
    active: boolean,
}
function NumberedBadge({ num, active }: NumberedBadgeProps) {
    return (
        <div className="h-7 w-7 mr-2 flex items-center justify-center border-2 border-brand rounded-full">
            <span className={`${active ? 'text-brand font-semibold' : 'text-gray-500'}`}>{num}</span>
        </div>
    )
}
