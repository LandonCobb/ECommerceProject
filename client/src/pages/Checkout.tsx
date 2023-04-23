import * as React from "react";
import * as T from "../types";
import * as API from "../services";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, Button, Divider, message } from "antd";
import {
  MinusCircleOutlined,
  RocketOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import "../styles/checkout.css";
import "../styles/home.css";

const moneyFormat = (number: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);

const Checkout: React.FC = () => {
  const [cart, setCart] = React.useState<T.Cart | null>();
  const [cartItems, setCartItems] = React.useState<T.Item[]>([]);
  const [loggedInUser, setLoggedInUser] = React.useState<T.User | null>();
  const [inited, setInited] = React.useState(false);
  const [order, setOrder] = React.useState<T.Order | null>(null);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  React.useEffect(() => {
    const init = async () => {
      const _cart = JSON.parse(localStorage.getItem("@cart") || "{}") as T.Cart;
      setCart(_cart);
      const allItems = await API.getAllItems();
      setCartItems(allItems.filter((x) => _cart.items.includes(x._id)));
      const _loggedInUser = await API.validatedUser();
      setLoggedInUser(_loggedInUser);
      setInited(true);
    };
    init();
  }, []);

  if (!inited) return <div>Loading...</div>;

  if (inited && !loggedInUser) return <Navigate to="/" />;

  const removeFromCart = async (itemId: string) => {
    const _cart = await API.removedFromCart(cart?._id || "", itemId);
    setCart(_cart);
    localStorage.setItem("@cart", JSON.stringify(_cart));
    const allItems = await API.getAllItems();
    setCartItems(allItems.filter((x) => _cart?.items.includes(x._id)));
  };

  const placeOrder = async () => {
    const _order = await API.placeOrder(
      cart?._id || "",
      loggedInUser?._id || ""
    );
    if (_order) {
      setOrder(_order);
      messageApi.success("Order Placed!");
    } else messageApi.error("Failed ot place order.");
  };

  return (
    <div className="checkout-main">
      {contextHolder}
      <h1>Checkout</h1>
      <br />
      {order ? (
        <div className="drawer-container" style={{ width: "100%" }}>
          <h2>Order Placed!</h2>
          <p>
            Order&nbsp;<b>{order._id}</b>&nbsp; is placed. Sit tight and wait
            for your items!
          </p>
          <Button
            type="default"
            icon={<HomeOutlined />}
            onClick={() => navigate("/")}
          >
            Go Home
          </Button>
        </div>
      ) : (
        <React.Fragment>
          <div className="drawer-container" style={{ width: "100%" }}>
            {!cart?.items.length && <h2>Your cart is empty :(</h2>}
            {cartItems.map((item, i) => (
              <Card key={i} className="drawer-card" style={{ width: "70%" }}>
                {item?.itemTitle}
                <br />
                {moneyFormat((item?.itemUnitPrice || 0) / 100)}
                <Button
                  style={{ float: "right" }}
                  type="primary"
                  danger
                  icon={<MinusCircleOutlined />}
                  onClick={() => removeFromCart(item?._id || "")}
                />
              </Card>
            ))}
          </div>
          <Divider>Order Total</Divider>
          {moneyFormat(
            cartItems
              .filter((x) => cart?.items.includes(x._id))
              .map((x) => x.itemUnitPrice / 100)
              .reduce((p, c) => p + c, 0)
          )}
          <br />
          <br />
          <div className="checkout-button-bar ">
            <Button
              type="default"
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<RocketOutlined />}
              onClick={placeOrder}
            >
              Place Order
            </Button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Checkout;
