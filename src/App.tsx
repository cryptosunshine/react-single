
import TransactionAction from "./TransactionAction";
import { textData2 } from "./data"
import "./App.css";

function App() {

  return (
    <div className="App" >
      {
        textData2.map((e, i) => {

          return <>
            <TransactionAction key={i} transaction={e.transaction}
              event={e.event && e.event}
              customInfo={e.customInfo && e.customInfo}
            />
            <br />
          </>;
        })
      }

      < br />
    </div >
  );
}

export default App;

