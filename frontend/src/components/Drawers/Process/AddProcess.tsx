import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  useAddProductMutation,
  useCreateProcessMutation,
  useCreateProformaInvoiceMutation,
} from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import AddItems from "../../Dynamic Add Components/AddItems";

interface AddProcess {
  closeDrawerHandler: () => void;
  fetchProcessHandler: () => void;
}

const AddProcess: React.FC<AddProcess> = ({
  closeDrawerHandler,
  fetchProcessHandler,
}) => {
  const [cookies] = useCookies();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [process, setProcess] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();

  const [addProcess] = useCreateProcessMutation();

  const addProformaInvoiceHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      process: process,
      description: description,
    };

    try {
      setIsAdding(true);
      const response = await addProcess(data).unwrap();
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      closeDrawerHandler();
      fetchProcessHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
          <BiX onClick={closeDrawerHandler} size="26px" />
          Process
        </h1>

        <div className="mt-8 px-5">
          <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
            Add New Process
          </h2>

          <form onSubmit={addProformaInvoiceHandler}>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Process</FormLabel>
              <Input
                value={process}
                onChange={(e) => setProcess(e.target.value)}
                type="text"
                placeholder="Process"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Description</FormLabel>
              <Input
                value={description}
                className="no-scrollbar"
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                placeholder="Description"
              />
            </FormControl>
            <Button
              isLoading={isAdding}
              type="submit"
              className="mt-1"
              color="white"
              backgroundColor="#1640d6"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </Drawer>
  );
};

export default AddProcess;
