import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./Header";
import HomePage from "./../decks/HomePage";
import Study from "./../decks/Study";
import ViewDeck from "./../decks/ViewDeck";
import CreateDeck from "./../decks/CreateDeck";
import EditDeck from "./../decks/EditDeck";
import CreateCard from "./../decks/CreateCard";
import EditCard from "./../decks/EditCard";
import NoMatch from "./../decks/NoMatch";
import {listCards,listDecks} from "./../utils/api/index.js";

function Layout() {

  const [decks, setDecks] = useState();
  const [formData, setFormData] = useState({});
  const [pageRerenderTrigger,setPageRerenderTrigger] = useState();
  const handleChange = ({target}) => {
      setFormData({
          ...formData,
          [target.name]: target.value,
      })
  }

  useEffect( () => {
    async function loadDecks () {
      const getDecks = await (listDecks())

      if (Array.isArray(getDecks)) {
        setDecks(getDecks);
      } else if (Array.isArray(getDecks) === false) {
        setDecks([getDecks]);
      } else {
        setDecks(getDecks);
        getDecks.map( async (deck) => {
          const getCards = await listCards(deck.id);
          deck["cards"] = getCards;
        })
      }}

    loadDecks();

  },[]) 



  return (
    <div>
    <Header />
      <Switch>

        <Route exact path="/">
          <HomePage 
            decks={decks}
            pageRerenderTrigger={pageRerenderTrigger} 
            setPageRerenderTrigger={setPageRerenderTrigger}/>
        </Route>

        <Route exact path="/decks/:deckId/study"> 
          <Study/>
        </Route>

        <Route exact path="/decks/new/">
          <CreateDeck
            pageRerenderTrigger={pageRerenderTrigger} 
            setPageRerenderTrigger={setPageRerenderTrigger}/>
        </Route>

        <Route exact path="/decks/:deckId/edit">
          <EditDeck/>
        </Route>

        <Route exact path="/decks/:deckId/cards/new">
          <CreateCard 
            formData={formData} 
            setFormData={setFormData} 
            handleChange={handleChange}/>
          </Route>

        <Route exact path="/decks/:deckId/cards/:cardId/edit">
          <EditCard 
            formData={formData} 
            setFormData={setFormData} 
            handleChange={handleChange}/>
        </Route>

        <Route exact path="/decks/:deckId">
          <ViewDeck 
            pageRerenderTrigger={pageRerenderTrigger} 
            setPageRerenderTrigger={setPageRerenderTrigger}/>
        </Route>

        <Route>
          <NoMatch />
        </Route>

      </Switch>
    </div>
  )
}

export default Layout;

