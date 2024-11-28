import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import {
  useAddBomMutation,
  useAddProductMutation,
} from "../../../redux/api/api";
import { toast } from "react-toastify";
import RawMaterial from "../../Dynamic Add Components/RawMaterial";
import Process from "../../Dynamic Add Components/Process";

interface AddBomProps {
  closeDrawerHandler: () => void;
  fetchBomsHandler: () => void;
}

const AddBom: React.FC<AddBomProps> = ({
  closeDrawerHandler,
  fetchBomsHandler,
}) => {
  const [bomName, setBomName] = useState<string | undefined>();
  const [partsCount, setPartsCount] = useState<number>(0);
  const [totalPartsCost, setTotalPartsCost] = useState<number>(0);
  const [finishedGoodName, setFinishedGoodName] = useState<
    string | undefined
  >();
  const [finishedGoodId, setFinishedGoodId] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [quantity, setQuantity] = useState<number | undefined>();
  const [uom, setUom] = useState<string | undefined>();
  const [category, setCategory] = useState<
    { value: string; label: string } | undefined
  >();
  const supportingDoc = useRef<HTMLInputElement | null>(null);
  const [comments, setComments] = useState<string | undefined>();
  const [cost, setCost] = useState<string | undefined>();

  const [processes, setProcesses] = useState<string[]>([""]);

  const [addBom] = useAddBomMutation();

  const [rawMaterials, setRawMaterials] = useState<any[]>([
    {
      item_id: "",
      item_name: "",
      description: "",
      quantity: "",
      uom: "",
      //   image?: string;
      category: "",
      assembly_phase: "",
      supplier: "",
      supporting_doc: "",
      comments: "",
      unit_cost: "",
      total_part_cost: "",
    },
  ]);

  const categoryOptions = [
    { value: "finished goods", label: "Finished Goods" },
    { value: "raw materials", label: "Raw Materials" },
    { value: "semi finished goods", label: "Semi Finished Goods" },
    { value: "consumables", label: "Consumables" },
    { value: "bought out parts", label: "Bought Out Parts" },
    { value: "trading goods", label: "Trading Goods" },
    { value: "service", label: "Service" },
  ];

  const addBomHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    let modeifiedRawMaterials = rawMaterials.map((material) => ({
      ...material,
      category: material?.category?.value,
      item_name: material?.item_name?.label,
      item_id: material?.item_name?.value,
      assembly_phase: material?.assembly_phase?.value,
      supplier: material?.supplier?.value,
    }));

    const body = {
      raw_materials: modeifiedRawMaterials,
      processes: processes,
      finished_good: {
        item_id: finishedGoodId,
        item_name: finishedGoodName,
        description: description,
        quantity: quantity,
        uom: uom,
        category: category?.value,
        supporting_doc: supportingDoc,
        comments: comments,
        cost: cost,
      },
      bom_name: bomName,
      parts_count: partsCount,
      total_cost: totalPartsCost,
    };

    try {
      const response = await addBom(body).unwrap();
      toast.success(response?.message);
      fetchBomsHandler();
      closeDrawerHandler();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (
      rawMaterials[rawMaterials.length - 1].unit_cost !== "" &&
      rawMaterials[rawMaterials.length - 1].quantity !== ""
    ) {
      setPartsCount(rawMaterials.length);
      const cost = rawMaterials.reduce(
        (prev, current) => prev + +current?.unit_cost * +current?.quantity,
        0
      );
      setTotalPartsCost(cost);
    }
  }, [rawMaterials]);

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[50vw] md:w-[90vw] bg-white right-0 top-0 z-10 py-3"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
          <BiX onClick={closeDrawerHandler} size="26px" />
          Bill Of Materials (BOM)
        </h1>

        <div className="mt-8 px-5">
          <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
            Add New BOM
          </h2>

          <form onSubmit={addBomHandler}>
            <RawMaterial inputs={rawMaterials} setInputs={setRawMaterials} />
            <Process inputs={processes} setInputs={setProcesses} />
            <div>
              <FormLabel fontWeight="bold">Finished Good</FormLabel>
              <div className="grid grid-cols-4 gap-2">
                <FormControl className="mt-3 mb-5" isRequired>
                  <FormLabel fontWeight="bold">Finished Good Id</FormLabel>
                  <Input
                    border="1px"
                    borderColor="#a9a9a9"
                    value={finishedGoodId}
                    onChange={(e) => setFinishedGoodId(e.target.value)}
                    type="text"
                    placeholder="Finished Good Id"
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5" isRequired>
                  <FormLabel fontWeight="bold">Finished Good Name</FormLabel>
                  <Input
                    border="1px"
                    borderColor="#a9a9a9"
                    value={finishedGoodName}
                    onChange={(e) => setFinishedGoodName(e.target.value)}
                    type="text"
                    placeholder="Finished Good Name"
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5">
                  <FormLabel fontWeight="bold">Description</FormLabel>
                  <Input
                    border="1px"
                    borderColor="#a9a9a9"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"
                    placeholder="Description"
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5" isRequired>
                  <FormLabel fontWeight="bold">Quantity</FormLabel>
                  <Input
                    border="1px"
                    borderColor="#a9a9a9"
                    value={quantity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setQuantity(+e.target.value)
                    }
                    type="number"
                    placeholder="Quantity"
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5" isRequired>
                  <FormLabel fontWeight="bold">
                    Unit Of Measurement (UOM)
                  </FormLabel>
                  <Input
                    border="1px"
                    borderColor="#a9a9a9"
                    value={uom}
                    onChange={(e) => setUom(e.target.value)}
                    type="text"
                    placeholder="Unit Of Measurement (UOM)"
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5" isRequired>
                  <FormLabel fontWeight="bold">Category</FormLabel>
                  <Select
                    required
                    className="rounded mt-2 border border-[#a9a9a9]"
                    options={categoryOptions}
                    placeholder="Select"
                    value={category}
                    name="item_name"
                    onChange={(d: any) => {
                      setCategory(d);
                    }}
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5">
                  <FormLabel fontWeight="bold">Supporting Doc</FormLabel>
                  <input
                    ref={supportingDoc}
                    type="file"
                    placeholder="Choose a file"
                    accept=".pdf"
                    className="border border-[#a9a9a9] w-[300px] py-2 px-1"
                  />
                  {/* <Input
                    border="1px"
                    borderColor="#a9a9a9"
                    ref={}
                    // value={supportingDoc}
                    // onChange={(e) => setSupportingDoc(e.target.value)}
                    type="file"
                    placeholder="Supporting Doc"
                  /> */}
                </FormControl>
                <FormControl className="mt-3 mb-5">
                  <FormLabel fontWeight="bold">Comments</FormLabel>
                  <Input
                    border="1px"
                    borderColor="#a9a9a9"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    type="text"
                    placeholder="Comments"
                  />
                </FormControl>
                <FormControl className="mt-3 mb-5" isRequired>
                  <FormLabel fontWeight="bold">Cost</FormLabel>
                  <Input
                    border="1px"
                    borderColor="#a9a9a9"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    type="number"
                    placeholder="Cost"
                  />
                </FormControl>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">BOM Name</FormLabel>
                <Input
                  border="1px"
                  borderColor="#a9a9a9"
                  value={bomName}
                  onChange={(e) => setBomName(e.target.value)}
                  type="text"
                  placeholder="BOM Name"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">Parts Count</FormLabel>
                <input
                  disabled={true}
                  value={partsCount}
                  // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  //   setPartsCount(+e.target.value)
                  // }
                  type="number"
                  placeholder="Parts Count"
                  className="rounded px-2 py-[6px] w-[300px] border-[1px] border-[#a9a9a9] disabled:cursor-not-allowed"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">Total Parts Cost</FormLabel>
                <input
                  disabled={true}
                  value={totalPartsCost}
                  // onChange={(e: any) =>
                  //   totalPartsCost(+e.target.value)
                  // }
                  type="number"
                  placeholder="Total Parts Cost"
                  className="rounded px-2 py-[6px] w-[300px] border-[1px] border-[#a9a9a9] disabled:cursor-not-allowed"
                />
              </FormControl>
            </div>

            <Button
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

export default AddBom;
