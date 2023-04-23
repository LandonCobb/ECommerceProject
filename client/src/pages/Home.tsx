import * as React from "react";
import * as API from "../services";
import * as T from "../types";
import {
  Button,
  Modal,
  Drawer,
  Card,
  Divider,
  Form,
  Input,
  message,
} from "antd";
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

const moneyFormat = (number: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);

const Home: React.FC = () => {
  const [cart, setCart] = React.useState<T.Cart | null>(null);
  const [items, setItems] = React.useState<T.Item[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [openLogin, setOpenLogin] = React.useState(false);
  const [openCart, setOpenCart] = React.useState(false);
  const [loadingLogin, setLoadingLogin] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loginRedirect, setLoginRedirect] = React.useState(false);
  const [registerFlag, setRegisterFlag] = React.useState(false)
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  React.useEffect(() => {
    const init = async () => {
      setItems(await API.getAllItems());
      const lsCart = localStorage.getItem("@cart");
      if (!lsCart) {
        const cart = await API.createCart();
        setCart(cart);
        localStorage.setItem("@cart", JSON.stringify(cart));
      } else {
        const _cart = JSON.parse(lsCart);
        const expireDate = new Date(_cart.expires);
        if (new Date().getTime() > expireDate.getTime()) {
          const cart = await API.createCart();
          setCart(cart);
          localStorage.setItem("@cart", JSON.stringify(cart));
        } else setCart(_cart);
      }
      const _loggedIn = await API.validateAuthState();
      setLoggedIn(_loggedIn);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return <div>loading....</div>;

  const onSubmit = async (values: any) => {
    setLoadingLogin(true);
    if (registerFlag) {
      const register = await API.register(values.username, values.password)
      if (register) {
        messageApi.success("Registered!")
        const tokens = await API.login(values.username, values.password);
        if (tokens) {
          localStorage.setItem("@token", tokens.token);
          messageApi.success("Logged In!");
          setLoggedIn(true);
          if (loginRedirect) navigate("/checkout");
        } else messageApi.error("Failed to register");
      } else messageApi.error("Failed to login post register")
    } else {
      const tokens = await API.login(values.username, values.password);
      if (tokens) {
        localStorage.setItem("@token", tokens.token);
        messageApi.success("Logged in!");
        setLoggedIn(true);
        if (loginRedirect) navigate("/checkout");
      } else messageApi.error("Invlaid Credentials");
    }
    setLoadingLogin(false);
    setOpenLogin(false);
  };

  const addToCart = async (itemId: string) => {
    const _cart = await API.addToCart(cart?._id || "", itemId);
    setCart(_cart);
    localStorage.setItem("@cart", JSON.stringify(_cart));
    setOpenCart(true);
  };

  const removeFromCart = async (itemId: string) => {
    const _cart = await API.removedFromCart(cart?._id || "", itemId);
    setCart(_cart);
    localStorage.setItem("@cart", JSON.stringify(_cart));
  };

  const logout = () => {
    localStorage.removeItem("@token");
    setLoggedIn(false);
    messageApi.success("Logged out")
  };

  const checkout = () => {
    if (!loggedIn) {
      messageApi.error("Must be logged in to proceed");
      setLoginRedirect(true);
      return setOpenLogin(true);
    }
    return navigate("/checkout");
  };

  return (
    <React.Fragment>
      {contextHolder}
      <div className="header">
        <h1>Stolen Phone Catalog</h1>
        <div className="spacer" />
        <div>
          <Button
            style={{ marginRight: 10 }}
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={() => setOpenCart(true)}
          />
          {loggedIn ? (
            <Button type="primary" onClick={logout}>
              Log out
            </Button>
          ) : (
            <Button type="primary" onClick={() => setOpenLogin(true)}>
              Login
            </Button>
          )}
        </div>
      </div>
      <div className="card-container">
        {items.map((item, i) => (
          <Card key={i} className="card">
            <h4>{item.itemTitle}</h4>
            <p>{item.itemDescription}</p>
            <p>{moneyFormat(item.itemUnitPrice / 100)}</p>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => addToCart(item._id)}
            >
              Add to Cart
            </Button>
          </Card>
        ))}
      </div>
      <Modal
        open={openLogin}
        onCancel={() => setOpenLogin(false)}
        title={registerFlag ? "Register" : "Login"}
        footer={[
          <Button key="back" onClick={() => setOpenLogin(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
            disabled={loadingLogin}
          >
            {registerFlag ? "Register" : "Login"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onSubmit}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
        </Form>
        <Button type="link" onClick={() => setRegisterFlag(true)}>Register</Button>
      </Modal>
      <Drawer open={openCart} onClose={() => setOpenCart(false)}>
        <div className="drawer-container">
          {!cart?.items.length && <h2>Your cart is empty :(</h2>}
          {cart?.items.map((itemId, i) => {
            const item = items.find((x) => x._id === itemId);
            return (
              <Card key={i} className="drawer-card">
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
            );
          })}
        </div>
        <Divider>Total</Divider>
        {moneyFormat(
          items
            .filter((x) => cart?.items.includes(x._id))
            .map((x) => x.itemUnitPrice / 100)
            .reduce((p, c) => p + c, 0)
        )}
        <br />
        <br />
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={checkout}
        >
          Proceed to Checkout
        </Button>
      </Drawer>
    </React.Fragment>
  );
};

export default Home;
