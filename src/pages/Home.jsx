import "./Home.css"
import Card from "../components/Card.jsx"

export default function Home() {
    return (
        <section id="home">
            <Card> 
                <h3>Account Balances</h3>
            </Card>
            <Card>
                <h3>Portfolio Value Over Time</h3>
            </Card>
            <Card>
                <h3>Holdings:</h3>
            </Card>
        </section>
    )
}