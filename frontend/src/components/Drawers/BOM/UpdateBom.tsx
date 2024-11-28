import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  useAddBomMutation,
  useAddProductMutation,
  useUpdateBOMMutation,
} from "../../../redux/api/api";
import { toast } from "react-toastify";
import RawMaterial from "../../Dynamic Add Components/RawMaterial";
import Process from "../../Dynamic Add Components/Process";
import { useCookies } from "react-cookie";

interface UpdateBomProps {
  closeDrawerHandler: () => void;
  fetchBomsHandler: () => void;
  bomId: string | undefined;
}

const UpdateBom: React.FC<UpdateBomProps> = ({
  closeDrawerHandler,
  fetchBomsHandler,
  bomId,
}) => {
  const [cookies] = useCookies();
  const [isLoadingBom, setIsLoadingBom] = useState<boolean>(false);
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
  const [supportingDoc, setSupportingDoc] = useState<string | undefined>();
  const [comments, setComments] = useState<string | undefined>();
  const [cost, setCost] = useState<string | undefined>();

  const [processes, setProcesses] = useState<string[]>([""]);

  const [updateBom] = useUpdateBOMMutation();

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

  const updateBomHandler = async (e: React.FormEvent) => {
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
      _id: bomId,
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
      const response = await updateBom(body).unwrap();
      toast.success(response?.message);
      fetchBomsHandler();
      closeDrawerHandler();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const fetchBomDetails = async () => {
    try {
      setIsLoadingBom(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `bom/${bomId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
    //   console.log(data.bom);

      setBomName(data.bom.bom_name);
      setPartsCount(data.bom.parts_count);
      setTotalPartsCost(data.bom.total_cost);

      setFinishedGoodId(data.bom.finished_good.item_id);
      setFinishedGoodName(data.bom.finished_good.item_name);
      setDescription(data.bom.finished_good.description);
      setQuantity(data.bom.finished_good.quantity);
      setCost(data.bom.finished_good.cost);
      setUom(data.bom.finished_good.uom);
      setComments(data.bom.finished_good.comments);
      setCategory({value: data.bom.finished_good.category, label: data.bom.finished_good.category})

      setProcesses(data.bom.processes);

      const inputs: any = [];
      data.bom.raw_materials.forEach((material: any) => {
        inputs.push({
          item_id: material.item_id,
          item_name: {value: material.item_id, label: material.item_name},
          description: material.description,
          quantity: material.quantity,
          uom: material.uom,
          //   image?: string;
          category: {value: material.category, label: material.category},
          assembly_phase: {value: material?.assembly_phase, label: material?.assembly_phase},
          supplier: {
            value: material?.supplier?._id, label: material?.supplier?.name
          },
          supporting_doc: "",
          comments: material?.comments,
          unit_cost: material.unit_cost,
          total_part_cost: material.total_part_cost,
        });
      });
      setRawMaterials(inputs);
      
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingBom(false);
    }
  };

  useEffect(() => {
    fetchBomDetails();
  }, []);

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
            Update BOM
          </h2>

          <form onSubmit={updateBomHandler}>
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
                  <Input
                    border="1px"
                    borderColor="#a9a9a9"
                    value={supportingDoc}
                    onChange={(e) => setSupportingDoc(e.target.value)}
                    type="text"
                    placeholder="Supporting Doc"
                  />
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

export default UpdateBom;
