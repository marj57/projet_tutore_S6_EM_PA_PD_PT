import React, { Component } from 'react';
import FirebaseManager from '../Manager/FirebaseManager';


class Recette extends Component {

  constructor(){
    super();
    this.state = {
      recettes: null,
      loading: true
    }
  }

  async componentWillMount(){
    var response = await FirebaseManager.getOnceRecipe(this.props.match.params.id);
    this.setState({recettes: response, loading: false});
  }

  render() {
    if(this.state.loading) {
      return (
        <img src='../img/spinner.gif' className="spinner" alt="Load-Spinner"/>      
        )
    }
    const affIngredient = this.state.recettes.ingredient.map((value) => {
      var affUnit = value['unit'];

      if(affUnit == "soupe") {
        affUnit = "Cuillère à soupe";
      } else if(affUnit == "cafe") {
        affUnit = "Cuillère à soupe";
      }

      return(<li><span style={{margin: 5}}>{value['label']}</span> : <span style={{margin: 5}}>{value['quantite']+" "+affUnit} </span></li>);
    })


    return(
      <div className="container col-xl">
        <div className="row">
          <div className="col-md-4 justify-content-center space" style={{paddingRight: "100px"}}>
            <img src={this.state.recettes.image} alt="recette" className="figure-img img-fluid" style={{width: "600px"}}/>
            <h2 className="title-recette">{this.state.recettes.nom}</h2>
            <table className="table-sm tableau">
              <tr>
                <td>
                  <img src="../img/gateau_parts.png" style={{width: "75px"}}/>
                </td>
                <td></td>
                <td>
                  <p className="p-list">{this.state.recettes.nbr_pers}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <img src="../img/materiel.png" style={{width: "75px"}}/>
                </td>
                <td></td>
                <td>
                  <p className="p-list">{this.state.recettes.temps_preparation}</p>
                </td>
              </tr>
            
              <tr>
              <td>
                  <img src="../img/four.png" style={{width: "60px"}}/>
                </td>
                <td></td>
                <td>
                  <p className="p-list">{this.state.recettes.temps_cuisson}</p>
                </td>
              </tr>
            </table>
          </div>
          <div className="col-md-8" style={{height: "500px"}}>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item">
                <a className="nav-link active" id="ingredients-tab" data-toggle="tab" href="#ingredients" role="tab" aria-controls="ingredients" aria-selected="true">Ingrédients et matériel</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="preparation-tab" data-toggle="tab" href="#preparation" role="tab" aria-controls="preparation" aria-selected="false">Préparation</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="commentaires-tab" data-toggle="tab" href="#commentaires" role="tab" aria-controls="commentaires" aria-selected="false">Astuces et commentaires</a>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div className="tab-pane fade show active text-left" id="ingredients" role="tabpanel" aria-labelledby="ingredients-tab">
                <ul>
                  {affIngredient}
                </ul>
              </div>
              <div className="tab-pane fade scroll text-left" id="preparation" role="tabpanel" aria-labelledby="preparation-tab">
                {this.state.recettes.preparation}
              </div>
              <div className="tab-pane fade text-left" id="commentaires" role="tabpanel" aria-labelledby="commentaires-tab">
                {this.state.recettes.astuces}
              </div>
            </div>
          </div>
        </div>
    </div>
    );

  }
}

export default Recette;

