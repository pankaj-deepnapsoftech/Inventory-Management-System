import { Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import ProcessTable from "../components/Table/ProcessTable";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddProcessDrawer,
  closeProcessDetailsDrawer,
  closeUpdateProcessDrawer,
  openAddProcessDrawer,
  openProcessDetailsDrawer,
  openUpdateProcessDrawer,
} from "../redux/reducers/drawersSlice";
import AddProcess from "../components/Drawers/Process/AddProcess";
import ProcessDetails from "../components/Drawers/Process/ProcessDetails";
import UpdateProcess from "../components/Drawers/Process/UpdateProcess";

const Process: React.FC = () => {
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [data, setData] = useState<any[] | []>([]);
  const [filteredData, setFilteredData] = useState<any[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cookies] = useCookies();
  const [id, setId] = useState<string | undefined>();

  const fetchProcessHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "process/all",
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

      setData(data.processes);
      setFilteredData(data.processes);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const {
    isAddProcessDrawerOpened,
    isUpdateProcessDrawerOpened,
    isProcessDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  const openAddProcessDrawerHandler = () => {
    dispatch(openAddProcessDrawer());
  };
  const closeAddProcessDrawerHandler = () => {
    dispatch(closeAddProcessDrawer());
  };
  const openProcessDetailsDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openProcessDetailsDrawer());
  };
  const closeProcessDetailsDrawerHandler = () => {
    dispatch(closeProcessDetailsDrawer());
  };
  const openUpdateProcessDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openUpdateProcessDrawer());
  };
  const closeUpdateProcessDrawerHandler = () => {
    dispatch(closeUpdateProcessDrawer());
  };

  useEffect(() => {
    fetchProcessHandler();
  }, []);

  return (
    <div>

      {isAddProcessDrawerOpened && <AddProcess fetchProcessHandler={fetchProcessHandler} closeDrawerHandler={closeAddProcessDrawerHandler} />}
      {isProcessDetailsDrawerOpened && <ProcessDetails id={id} closeDrawerHandler={closeProcessDetailsDrawerHandler} />}
      {isUpdateProcessDrawerOpened && <UpdateProcess id={id} closeDrawerHandler={closeUpdateProcessDrawerHandler} fetchProcessHandler={fetchProcessHandler} />}


      <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-8">
        <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
          Process
        </div>

        <div className="mt-2 md:mt-0 flex flex-wrap gap-y-1 gap-x-2 w-full md:w-fit">
          <textarea
            className="rounded-[10px] w-full md:flex-1 px-2 py-2 md:px-3 md:py-2 text-sm focus:outline-[#1640d6] hover:outline:[#1640d6] border resize-none border-[#bbbbbb] bg-[#f9f9f9]"
            rows={1}
            //   width="220px"
            placeholder="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 100 }}
            onClick={fetchProcessHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#1640d6"
            borderColor="#1640d6"
            variant="outline"
          >
            Refresh
          </Button>
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 200 }}
            onClick={openAddProcessDrawerHandler}
            color="white"
            backgroundColor="#1640d6"
          >
            Add New Process
          </Button>
        </div>
      </div>

      <div>
        <ProcessTable isLoadingProcess={isLoading} process={filteredData} />
      </div>
    </div>
  );
};

export default Process;
