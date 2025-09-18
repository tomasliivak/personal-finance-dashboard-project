import Home from "../pages/Home.jsx"
import Holdings from "../pages/Holdings.jsx"
import Insights from "../pages/Insights.jsx"
import Transactions from "../pages/Transactions.jsx"

export default [
    {path: "/", element: <Home />, label: "Dashboard"},
    {path: "/holdings", element: <Holdings />, label: "Holdings"},
    {path: "/insights", element: <Insights />, label: "Insights"},
    {path: "/transactions", element: <Transactions />, label: "Transactions"}
  ]