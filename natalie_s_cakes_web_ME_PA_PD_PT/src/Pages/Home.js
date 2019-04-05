import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import FirebaseManager from '../Manager/FirebaseManager';
import '../App.css';
import { Modal, Button, Table, Divider, Rate } from 'antd';
import "antd/dist/antd.css";


const confirm = Modal.confirm;

class Home extends Component {
  constructor(){
    super();
    this.state = {
      loading: true, 
      recettes: [],
    }
  }

  componentWillMount(){
    this.loadRecipe();
  }

  async loadRecipe() {
    var response = await FirebaseManager.getRecipe();
    this.setState({
        recettes: response,
        loading: false
    });
  }

  async delete(id) {
    var self = this;
    confirm({
      title: 'Etes-vous sûr de vouloir supprimer cette recette ?',
      content: '',
      okText: 'OUI',
      okType: 'danger',
      cancelText: 'NON',
      async onOk() {
        await FirebaseManager.deleteRecipe(id);
        self.loadRecipe();
      },
    });
  }

  render() {
    if(this.state.loading) {
      return (
        <img src='../img/spinner.gif'className="spinner" alt="Load-Spinner" />      
        )
    }

    const { message, onRemoveMessage } = this.props;

    const { Column } = Table;

    const recets = this.state.recettes.map((recette, i) => {
      var rate = parseInt(recette.difficulte, 10);
      if(rate === NaN) {
        rate = 0;
      }

     const date = new Date(recette.date.seconds*1000);
     const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

      return {
        key: i ,
        image: <Link to={"/recette/"+recette.id}><img style={{ resizeMode: 'skretch', height: 150 }} alt="recette" src={recette.image} width={200}/></Link>,
        nom: <Link to={"/recette/"+recette.id}>{recette.nom}</Link>,
        date: date.toLocaleDateString('fr-FR', options),
        tags: recette.tags,
        difficulte: <Rate disabled allowHalf defaultValue={rate}/>,
      };
    });

    return (
        <Table dataSource={recets}> 
            <Column
              title="Image"
              dataIndex="image"
              key="image"
            />

            <Column
                title="Nom"
                dataIndex="nom"
                key="nom"
            />

             <Column
                title="Date de création"
                dataIndex="date"
                key="date"
            />

            <Column
            title="Tags"
            dataIndex="tags"
            key="tags"
            />

            <Column
            title="Difficulté"
            dataIndex="difficulte"
            key="difficulte"
            />

            />
            <Column
            title="Actions"
            key="action"
            render={(text, record, index) => (
                <span>
                  <Link to={"/recette/"+this.state.recettes[index].id}><Button type="default" icon="eye"/></Link>
                  <Divider type="vertical" />
                  <Link to={"/edit/"+this.state.recettes[index].id}><Button type="primary" icon="edit"/></Link>
                  <Divider type="vertical" />
                  <Button type="danger" icon="delete" onClick={() => this.delete(this.state.recettes[index].id)} />
                </span>
            )}
            />
        </Table>
    );
  }
}

export default Home;
