import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiMinus } from "react-icons/bi";
import { IoIosAdd } from "react-icons/io";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";

interface ProductionProcessProps {
  inputs: any[];
  setInputs: (input: any) => void;
}

const ProductionProcess: React.FC<ProductionProcessProps> = ({
  inputs,
  setInputs,
}) => {
  // const [inputs, setInputs] = useState<string[]>([""]);

  //   const addInputHandler = () => {
  //     setInputs((prev: any[]) => [...prev, ""]);
  //   };

  //   const deleteInputHandler = (ind: number) => {
  //     const inputsArr = [...inputs];
  //     inputsArr.splice(ind, 1);
  //     setInputs(inputsArr);
  //   };

  const onChangeHandler = (isChecked: boolean, ind: number) => {
    const inputsArr = [...inputs];
    inputsArr[ind].done = isChecked;
    setInputs(inputsArr);
  };

  return (
    <div>
      <FormLabel fontWeight="bold">Processes</FormLabel>
      <div className="grid grid-cols-4 gap-2">
        {inputs.map((input, ind) => (
          <>
            <FormControl className="flex gap-1 items-center" key={ind}>
              <Input
                isDisabled
                border="1px"
                borderColor="#a9a9a9"
                type="text"
                name="process"
                value={input.process}
              ></Input>
              {/* {input.done ? (
                <IoCheckmarkDoneCircleSharp size={40} color="#0c9705" />
              ) : ( */}
                {/* <Checkbox
                  size="lg"
                  onChange={(e) => {
                    onChangeHandler(e.target.checked, ind);
                  }}
                  isChecked={input.done}
                /> */}
              {/* )} */}
              <input type="checkbox" className="h-[30px] w-[30px]" checked={input.done} onChange={(e)=>onChangeHandler(e.target.checked, ind)} />
            </FormControl>
          </>
        ))}
      </div>
      {/* <div className="text-end mt-1">
        {inputs.length > 1 && (
          <Button
            onClick={() => deleteInputHandler(inputs.length - 1)}
            leftIcon={<BiMinus />}
            variant="outline"
            className="mr-1 bg-[#a9a9a9]"
          >
            Remove
          </Button>
        )}
        <Button
          onClick={addInputHandler}
          leftIcon={<IoIosAdd />}
          variant="outline"
          className="bg-[#a9a9a9]"
        >
          Add
        </Button>
      </div> */}
    </div>
  );
};

export default ProductionProcess;
