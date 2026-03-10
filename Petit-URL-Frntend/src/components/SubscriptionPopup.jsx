import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

export default function SubscriptionPopup({ isOpen, onClose }) {
    const navigate = useNavigate();

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div>
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                                        <SparklesIcon className="h-8 w-8 text-primary-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-5 text-center sm:mt-6">
                                        <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900">
                                            Link Limit Reached!
                                        </Dialog.Title>
                                        <div className="mt-3">
                                            <p className="text-sm text-gray-500">
                                                You've created 3 short links on the free plan. Upgrade to Premium to create unlimited links, get custom aliases, and access advanced analytics!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                    <Button
                                        type="button"
                                        className="w-full sm:col-start-2"
                                        onClick={() => {
                                            onClose();
                                            navigate('/dashboard/subscription');
                                        }}
                                    >
                                        View Plans
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="mt-3 w-full sm:col-start-1 sm:mt-0"
                                        onClick={onClose}
                                    >
                                        Maybe Later
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
