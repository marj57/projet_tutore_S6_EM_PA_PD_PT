import React, { Component } from 'react';
import FirebaseManager from '../Manager/FirebaseManager';
import { Redirect } from 'react-router'
import '../App.css';

import { Form, Rate, Input, Select, Upload, Icon, message, DatePicker, InputNumber, Row, Col, Button } from 'antd';
import "antd/dist/antd.css";

import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import TagsField from '../Component/TagsField';
import { Button as BTN} from 'semantic-ui-react';

const style = <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css'/>

const InputGroup = Input.Group;
const { OptGroup } = Select;

Array.prototype.contains = function(elem) {
    for(var i in this) {
        if(this[i] == elem) return true;
    }
    return false;
}

class Add extends Component {
    state = {
        imageUrl:null,
        redirect: false, // état à faux pour rester sur la page du formulaire
        loading: true,
        actualRecipe: {
            id: -1,
            nom: "",
            difficulte: 3.5,
            astuces: "",
            temps_cuisson: 15,
            temps_preparation: 10,
            nbr_pers: 1,
            materiel: "",
            tags: "",
            type: "",
            date: new Date(),
            ingredient: [],
            preparation: ""
        },
        isSend: false,
        tagsField: {tag: [], valid: false},
        fields: [],
} 

    onCancel() {
        this.setState({
            redirect: true,
        })
    }

    async componentWillMount() {
       if(this.props.match.params.id != null) {
            var recipe = await FirebaseManager.getOnceRecipe(this.props.match.params.id);

            if(recipe != null) {
                recipe.date = new Date(recipe.date.seconds*1000);
                this.setState({actualRecipe: recipe, loading: false});
            } else {
                message.warning("Identifiant invalide !");
                this.setState({redirect: true, loading: false});//état à true pour afficher la page accueil
            }
       } else {
            this.setState({loading: false});
       }
       this.loadIngredient();
    }

    loadIngredient() {
        var fields = [];
        for(var i=0; i<this.state.actualRecipe.ingredient.length; i++) {
            fields.push(i);
        }

        if(fields.length == 0) {
            fields = [0];
        }
        this.setState({fields: fields});
    }
//pour rajouter les données dans l'array recette en bdd
handleSubmit(event) {
    event.preventDefault();
    this.props.form.validateFields(async (err, values) => {
        console.log(err);
        if (err || !this.state.tagsField.valid) {
          return;
        };

        if(this.state.imageUrl !== null) {
            values.image = this.state.imageUrl;
        }

        values.tags = this.state.tagsField.tag;

        var recette = this.state.actualRecipe;

        if(recette.id < 0) {
            values.date = new Date();
            await FirebaseManager.addRecipe(values);
        } else {
            values.id = recette.id;
            values.date = recette.date;
            if(values.image === null || values.image === undefined) {
                values.image = recette.image;
            }

            await FirebaseManager.EditRecipe(values);
        }

        
        message.success("Recette enregistrée !");

        this.setState({redirect: true});//état à true pour afficher la page accueil

     })
     this.setState({isSend: true})
}
    

    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    
    onUploadChange(info) {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} - Image téléchargée !`);
    
            this.getBase64(info.file.originFileObj, imageUrl => this.setState({
                imageUrl,
            }));
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} - une erreur est survenue lors du téléchargement de l'image.`);
        }
    }

    TagChange(fieldEvent) {
        this.setState({tagsField: fieldEvent});
    }

    AddField() {
        var fields = this.state.fields;

        fields.push(this.getFieldId());

        this.setState({
            fields: fields,
        })
    }

    getFieldId() {
        var i = 0;

        while(this.state.fields.contains(i)) {
            i++;
        } 
        return i;
    }

    removeField(i) {
        if(this.state.fields.length === 1) {
            return;
        }

        var fields = this.state.fields.filter(k => k != i);

        this.setState({
            fields: fields,
        })
    }

    render() {
        if(this.state.loading) {
            return (
              <img src='../img/spinner.gif'className="spinner" alt="Load-Spinner" />      
            )
        }

        const self = this;

        const formItemLayout = {
            labelCol: { span: 24 },
            wrapperCol: { span: 16 }
          }; 
        const { getFieldDecorator } = this.props.form;

        // on ajoute le fichier image à la liste
        const props = {
            action: '//jsonplaceholder.typicode.com/posts/',
            listType: 'picture',
        };

        const { Option } = Select;

        const dateFormat = 'DD/MM/YYYY';
        
        if(this.state.redirect){
            return <Redirect to="/"></Redirect>
        }else{
            var title = "Ajout d'une nouvelle recette";
            if(this.state.actualRecipe.id >= 0) {
                title = "Modifier une recette - " + this.state.actualRecipe.nom;
            }

            const formItems = this.state.fields.map((k) => {
                var value = {quantite: 0, unit: "", label: ""};

                if(this.state.actualRecipe.ingredient[k] != undefined) {
                    value = {
                        quantite: this.state.actualRecipe.ingredient[k]['quantite'], 
                        unit:  this.state.actualRecipe.ingredient[k]['unit'], 
                        label:  this.state.actualRecipe.ingredient[k]['label']
                    };
                }

                return (
                <Form.Item key={k} style={{marginBottom: 5}}>
                    <InputGroup compact>
                        {getFieldDecorator('ingredient['+k+'][quantite]', {
                            rules: [{
                                required: true,
                                message: 'merci d\'entrer une quantité !',
                            }],
                            initialValue: value.quantite,
                        })(
                            <InputNumber style={{width: 70}} placeholder="quantité" min={0} />
                        )}
                        {getFieldDecorator('ingredient['+k+'][unit]', {
                            initialValue: value.unit,
                        })(
                        <Select style={{width: 150}}>
                            <Option value="">Aucune unité</Option>
                            <OptGroup label="Poids">
                                <Option value="g">g</Option>
                                <Option value="kg">kg</Option>
                            </OptGroup>
                            <OptGroup label="Volume">
                                <Option value="mL">mL</Option>
                                <Option value="cL">cl</Option>
                                <Option value="L">L</Option>
                            </OptGroup>
                            <OptGroup label="Autre">
                                <Option value="cafe">Cuillère à café</Option>
                                <Option value="soupe">Cuillère à soupe</Option>
                                <Option value="pince">pincée</Option>
                                <Option value="sachet">sachet</Option>
                            </OptGroup>
                        </Select>
                         )}
                        {getFieldDecorator('ingredient['+k+'][label]', {
                            rules: [{
                                required: true,
                                message: 'merci d\'entrer une quantité !',
                            }],
                            initialValue: value.label,
                        })(
                            <Input style={{ width: '50%' }} placeholder="Nom de l'ingredient(s) !"  />
                        )}
                        {this.state.fields.length > 1 ? (
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            style={{ marginLeft: 10, fontSize: 20, verticalAlign: "middle" }}
                            onClick={this.removeField.bind(this, k)}
                        />):null}
                    </InputGroup>
              </Form.Item>
            )});

            return(
                <Form {...formItemLayout} onSubmit={this.handleSubmit.bind(this)} style={{ marginLeft:"30%" }}>
                <h2 style={{color: "#e22565", fontWeight:"bold", marginLeft: "-35%"}}>{title} : </h2><br/>
                    <Form.Item {...formItemLayout} label="Nom de la recette">
                        {getFieldDecorator('nom', {
                            initialValue: this.state.actualRecipe.nom,
                            rules: [{
                                required: true,
                                message: 'Entrez le nom',
                            }],
                        })(
                            <Input placeholder="Entrez le nom" name="nom"/>
                        )}
                    </Form.Item>

                    <Form.Item label="Date de création">
                        {getFieldDecorator('date', {
                                initialValue: moment(this.state.actualRecipe.date.toDateString()),
                                rules: [{
                                    required: true,
                                    message: 'Entrez la date',
                                }],
                            })(
                            <DatePicker format={dateFormat} disabled/>
                        )}
                    </Form.Item>

                    <Form.Item label="Difficulté">
                        {getFieldDecorator('difficulte', {
                            rules: [{
                                required: true,
                                message: 'Notez la difficulté',      
                            }], 
                            initialValue: this.state.actualRecipe.difficulte,     
                        })(
                            <Rate allowHalf />
                        )}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label = "Ingrédient">
                        {formItems}
                        <Form.Item>
                            <Button type="dashed" onClick={this.AddField.bind(this)} style={{ width: '60%' }}>
                                <Icon type="plus" /> Add field
                            </Button>
                        </Form.Item> 
                    </Form.Item>

                    <Form.Item {...formItemLayout} label = "Préparation">
                        {getFieldDecorator('preparation', {
                            rules: [{
                                required: true,
                                message: 'Comment se prépare la recette',
                            }],
                            initialValue: this.state.actualRecipe.preparation,  
                        })(
                            <TextArea rows={4} placeholder="Préparation de la recette" name="preparation"/>
                        )}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label = "Astuce(s) et commentaire(s)">
                        {getFieldDecorator('astuces', {
                            rules: [{
                                required: true,
                                message: 'Mettez y quelques astuces ou commentaires',
                            }],
                            initialValue: this.state.actualRecipe.astuces,  
                        })(
                            <TextArea rows={2} placeholder="Mettez une astuce ou un commentaire" name="astuces"/>
                        )}
                    </Form.Item>
                    
                    <Form.Item {...formItemLayout} label = "Matériel(s) à utiliser">
                        {getFieldDecorator('materiel', {
                            rules: [{
                                required: true,
                                message: 'Quel(s) matériel(s) nécessaire(s)',
                            }],
                            initialValue: this.state.actualRecipe.materiel,  
                        })(
                            <Input placeholder="Matériel(s) à utiliser" name="materiel"/>
                        )}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label = "Nombre de personne(s)">
                        {getFieldDecorator('nbr_pers', {
                            rules: [{
                                required: true,
                                message: 'Mettez le nombre de personne(s)',
                            }],
                            initialValue: this.state.actualRecipe.nbr_pers,
                        })(
                            <InputNumber placeholder="Nombre de personne(s)" name="nbr_pers" min={1} max={10}/>
                        )}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label = "Tags">
                        <TagsField min={1} defaultValue={this.state.actualRecipe.tags} onTagChange={this.TagChange.bind(this)}/>
                    </Form.Item>

                    <Form.Item {...formItemLayout} label = "Temps de cuisson en mn">
                        {getFieldDecorator('temps_cuisson', {
                            rules: [{
                                required: true,
                                message: 'Mettez le temps de cuisson',
                            }],
                            initialValue: this.state.actualRecipe.temps_cuisson,  
                        })(
                            <InputNumber placeholder="Temps de cuisson" name="temps_cuisson" min={15} max={240} />
                        )}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label = "Temps de préparation en mn">
                        {getFieldDecorator('temps_preparation', {
                            rules: [{
                                required: true,
                                message: 'Mettez le temps de préparation',
                            }],
                            initialValue: this.state.actualRecipe.temps_preparation,  
                        })(
                            <InputNumber placeholder="Temps de préparation" name="temps_preparation" min={10} max={180} />
                        )}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label="Type de recette" hasFeedback>
                        {getFieldDecorator('type',{
                            rules: [{
                                required: true,
                                message: 'Choisir le type de la recette',
                            }],
                            initialValue: this.state.actualRecipe.type,  
                        })(  
                            <Select name="type">
                                <Option value="classique">Classique</Option>
                                <Option value="américaine">Américaine</Option>
                                <Option value="Dessert à la coupe">Dessert</Option>
                            </Select>   
                        )}
                    </Form.Item>

                    <Form.Item>
                        {getFieldDecorator('image', {
                        rules: [{ required: false, message: 'Entrer une image' }],
                        })( 
                        <Upload {...props} name="image" onChange={this.onUploadChange.bind(this)}>
                            <div style={{ backgroundColor: '#f6f6f6', borderRadius: 10, padding: 10, cursor: 'pointer' }}>
                                <Icon type="upload" /> Télécharger
                            </div>                           
                        </Upload>
                        )}
                    </Form.Item> 

                    <Form.Item style={{position: "fixed", right: 50, top: '50%', zIndex: 1000}}>
                    <Row>
                            <Col>
                                {style}
                                <BTN.Group>
                                <BTN onClick={self.onCancel.bind(self)} style={{backgroundColor: '#e22565', color: '#fbf3c2'}}>Annuler</BTN>
                                <BTN.Or text="ou"/>
                                <BTN style={{backgroundColor: '#fbf3c2', color: '#e22565'}}>Enregistrer</BTN>
                                </BTN.Group>
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item>
                         <Button htmlType="submit" style={{display: 'none'}} />
                    </Form.Item>
                </Form>
            )
        }
    }
}

const AddForm = Form.create({ name : 'normal_login'})(Add);
export default AddForm;