import { CheckIcon } from "@heroicons/react/outline";
import { Dialog, Transition } from "@headlessui/react";
import {
  forwardRef,
  Fragment,
  useCallback,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import "./styles.css";

export const Modal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const resolver = useRef(null);
  const rejector = useRef(null);
  const handleClose = () => {
    rejector.current && rejector.current(new Error("invalid option"));
    setOpen(false);
  };

  const handleOpen = useCallback(async () => {
    setOpen(true);
    return new Promise(
      (resolve) => {
        resolver.current = resolve;
      },
      (reject) => {
        rejector.current = reject;
      }
    );
  }, []);
  const handleSubmit = useCallback((option) => {
    resolver.current && resolver.current(option);
    setOpen(false);
  }, []);
  useImperativeHandle(
    ref,
    () => ({
      open: handleOpen
    }),
    [handleOpen]
  );
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <CheckIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Payment successful
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Consequatur amet labore.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 flex space-x-2">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    onClick={() => handleSubmit("Optie A")}
                  >
                    Option A
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    onClick={() => handleSubmit("Optie B")}
                  >
                    Option B
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
});

export default function App() {
  const modalRef = useRef();
  const [options, setOptions] = useState([]);
  const handleClick = async () => {
    const chosenOption = await modalRef.current.open();
    setOptions((options) => [...options, chosenOption]);
    console.log(chosenOption);
  };
  return (
    <div className="App">
      <h1 className="text-2xl font-medium">
        Example showing an imperative modal screen
      </h1>
      <div className="py-5">
        <button
          onClick={handleClick}
          className="border rounded-md p-2 bg-gray-50"
        >
          Choose an option
        </button>
        <div className="space-y-2 py-5 w-28 mx-auto">
          {options.map((option, index) => (
            <p key={index}>{option}</p>
          ))}
        </div>
      </div>
      <Modal ref={modalRef} />
    </div>
  );
}
