import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useUpdateProductMutation } from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Loading from "../../../ui/Loading";

interface UpdateProductProps {
  closeDrawerHandler: () => void;
  fetchProductsHandler: () => void;
  productId: string | undefined;
}

const UpdateProduct: React.FC<UpdateProductProps> = ({
  closeDrawerHandler,
  productId,
  fetchProductsHandler,
}) => {
  const [name, setName] = useState<string | undefined>();
  const [id, setId] = useState<string | undefined>();
  const [uom, setUom] = useState<string | undefined>();
  const [category, setCategory] = useState<
    { value: string; label: string } | undefined
  >();
  const [currentStock, setCurrentStock] = useState<string | undefined>();
  const [price, setPrice] = useState<string | undefined>();
  const [minStock, setMinStock] = useState<string | undefined>();
  const [maxStock, setMaxStock] = useState<string | undefined>();
  const [hsn, setHsn] = useState<string | undefined>();

  const [cookies] = useCookies();

  const categoryOptions = [
    { value: "finished goods", label: "Finished Goods" },
    { value: "raw materials", label: "Raw Materials" },
    { value: "semi finished goods", label: "Semi Finished Goods" },
    { value: "consumables", label: "Consumables" },
    { value: "bought out parts", label: "Bought Out Parts" },
    { value: "trading goods", label: "Trading Goods" },
    { value: "service", label: "Service" },
  ];

  const [updateProduct] = useUpdateProductMutation();
  const [isLoadingProduct, setIsLoadingProduct] = useState<boolean>(false);
  const [isUpdatingProduct, setIsUpdatingProduct] = useState<boolean>(false);

  const updateProductHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdatingProduct(true);
      if (
        !name ||
        !id ||
        !uom ||
        !category ||
        !currentStock ||
        !price ||
        name.trim().length === 0 ||
        id.trim().length === 0 ||
        uom.trim().length === 0
      ) {
        throw new Error("Please fill all the fileds");
      }

      const response = await updateProduct({
        _id: productId,
        name,
        product_id: id,
        uom: uom,
        category: category?.value,
        min_stock: minStock,
        max_stock: maxStock,
        current_stock: currentStock,
        price: price,
        hsn,
      }).unwrap();
      toast.success(response.message);
      fetchProductsHandler();
      closeDrawerHandler();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setIsUpdatingProduct(false);
    }
  };

  const fetchProductDetails = async () => {
    try {
      setIsLoadingProduct(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `product/${productId}`,
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
      setName(data.product.name);
      setId(data.product.product_id);
      setCategory({
        value: data.product.category,
        label: data.product.category,
      });
      setUom(data.product.uom);
      setPrice(data.product.price);
      setCurrentStock(data.product.current_stock);
      setMinStock(data.product?.min_stock);
      setMaxStock(data.product?.max_stock);
      setHsn(data.product?.hsn);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setIsLoadingProduct(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

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
          Product
        </h1>

        <div className="mt-8 px-5">
          <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
            Update Product
          </h2>

          {isLoadingProduct && <Loading />}
          {!isLoadingProduct && (
            <form onSubmit={updateProductHandler}>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">Product ID</FormLabel>
                <Input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  type="text"
                  placeholder="Product ID"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">Product Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Product Name"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">Product Price</FormLabel>
                <Input
                  value={price}
                  className="no-scrollbar"
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  placeholder="Product Price"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">Product Category</FormLabel>
                <Select
                  value={category}
                  options={categoryOptions}
                  onChange={(e: any) => setCategory(e)}
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">
                  UOM (Unit of Measurement)
                </FormLabel>
                <Input
                  className="no-scrollbar"
                  value={uom}
                  onChange={(e) => setUom(e.target.value)}
                  type="text"
                  placeholder="UOM (Unit of Measurement)"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">Current Stock</FormLabel>
                <Input
                  value={currentStock}
                  onChange={(e) => setCurrentStock(e.target.value)}
                  type="number"
                  placeholder="Current Stock"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="bold">Min Stock</FormLabel>
                <Input
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value)}
                  type="number"
                  placeholder="Min Stock"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="bold">Max Stock</FormLabel>
                <Input
                  value={maxStock}
                  onChange={(e) => setMaxStock(e.target.value)}
                  type="number"
                  placeholder="Max Stock"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="bold">HSN</FormLabel>
                <Input
                  value={hsn}
                  onChange={(e) => setHsn(e.target.value)}
                  type="text"
                  placeholder="HSN"
                />
              </FormControl>
              <Button
                isLoading={isUpdatingProduct}
                type="submit"
                className="mt-1"
                color="white"
                backgroundColor="#1640d6"
              >
                Submit
              </Button>
            </form>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default UpdateProduct;
