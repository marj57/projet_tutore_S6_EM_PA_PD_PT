import firebase from './firebase';

Array.prototype.contains = function(elem)
{
    for (var i in this) {
        if (this[i] == elem) return true;
    }
    return false;
}

class FirebaseManager {
    static db = firebase.firestore().collection('recette');
    static nextId;

    static perPage = 3;

    static async getRecipe() {
        var response = await this.db.orderBy("date", "desc").get();
        return await this.getTab(response);
    }

    static async getRecipePage(page) {
        var response = await this.db.orderBy("date", "desc").limit(this.perPage*page).get();
        return await this.getTab(response);
    }

    static async getTagList() {
        var list = [];
        var response = await this.getRecipe();

        for(var i=0; i<response.length; i++) {
            for(var j=0; j<response[i].tags.length; j++) {
                var write = true;
                for(var k=0; k<list.length; k++) {
                    if(response[i].tags[j] == list[k]) {
                        write = false;
                    }
                }
                if(write) {
                    list.push(response[i].tags[j]);
                }
            }
        } 
        return list;
    }

    static async getRecipeByTag(tags, page) {
        var list = [];
        var response = await this.getRecipe();

        list = response.filter(recette => recette.tags.contains(tags));

        var max = page * this.perPage; 

        return list.slice(0, max);
    }

    static async toggleFavoris(recipe) {
        recipe.favoris = !recipe.favoris;
        this.EditRecipe(recipe);
        return recipe;
    }

    static async getRecipeByFavoris(page) {
        var list = [];
        var response = await this.getRecipe();

        list = response.filter(recette => recette.favoris);

        var max = page * this.perPage; 

        return list.slice(0, max);
    }

    static async getMaxPage() {
        var numberItem = (await this.getRecipe()).length;
        return Math.ceil(numberItem / this.perPage);
    }

    static async getTab(response) {
        var recette = [];

        response.forEach(function(r) {
            var value = r.data();
            recette.push(value);
        })

        return recette;
    }

    static async getOnceRecipe(id) {
        var response = await this.db.doc(''+id).get();
        return response.data();
    }
    
    static async EditRecipe(value) {
        this.db.doc(''+value.id).set(value);
    }

    static async deleteRecipe(id) {
        await this.db.doc(''+id).delete();
    }

    static async addRecipe(value) {
        this.nextId = await this.getNextId();
        value.id = this.nextId;
        this.db.doc(''+this.nextId).set(value);
        this.IncrementId();
    }

    static async getNextId() {
        var response = await this.firebase.firestore().collection('auto').doc("recette").get();
        return response.data().id;
    }

    static async IncrementId() {
        var id = parseInt(this.nextId, 10) + 1;
        this.db.doc("Next").set({id});
    }
}

export default FirebaseManager;