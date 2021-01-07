import { Transition } from '@headlessui/react'
import { UserAddIcon } from '../icons'
import ModalHOC from './Modal'

const InviteTeamMember: React.FC<{ isOpen: boolean; team: string; closeModal: () => void }> = ({
    isOpen,
    team,
    closeModal,
}) => {
    return (
        <ModalHOC isOpen={isOpen} closeModal={closeModal} modalWidth="w-10/12 md:w-5/12 lg:w-3/12">
            <div className="absolute inset-x-0 flex justify-center -mt-12">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500 border-2 border-white rounded-full">
                    <UserAddIcon className="w-8 h-8 text-white" />
                </div>
            </div>
            <div className="mt-3">
                <h3 className="text-lg font-medium text-center text-gray-600">Invite member to</h3>
                <div className="flex justify-center">
                    <span className="p-2 mt-1 italic font-bold text-center text-black border rounded border-brand">
                        {team}
                    </span>
                </div>

                <form className="flex flex-col items-center mt-8">
                    <div className="flex flex-col w-9/12">
                        <label className="text-gray-700" htmlFor="email">
                            Email address
                        </label>
                        <input
                            className="form-input"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="jeff@test.com"
                        />
                    </div>

                    <input
                        className="px-3 py-2 mt-6 text-white rounded cursor-pointer bg-brand hover:shadow hover:bg-brand-light"
                        type="submit"
                        value="Add member"
                    />
                </form>
            </div>
        </ModalHOC>
    )
}
export default InviteTeamMember
