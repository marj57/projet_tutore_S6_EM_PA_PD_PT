import {AsyncStorage, ToastAndroid} from 'react-native';

Array.prototype.contains = function(elem)
{
    for (var i in this) {
        if (this[i] == elem) return true;
    }
    return false;
}

Array.prototype.getIndexOf = function(elem)
{
    for (var i in this) {
        if (this[i] == elem) return i;
    }
    return 0;
}

export default class LocalStorageManager {
    static g = ['g', 'kg'];
    static gValue = [1, 1000];
    static L = ['mL', 'cL', 'L'];
    static LValue = [1, 10, 1000];

    static async getList() {
        var list = [];
        var response = await AsyncStorage.getAllKeys();

        for(var i=0; i<response.length; i++) {
            var val = await this.getItem(response[i]);
            if(val != null) {
                list.push(val);
            }
        }
        return list;
    }

    static async getItem(label) {
        var response = await AsyncStorage.getItem(label);

        value = JSON.parse(response);

        return value;
    }

    static async AddList(ingredientList) {
        for(var i=0; i<ingredientList.length; i++) {
            await this.Add(ingredientList[i]);
        }
        ToastAndroid.show("Ingrédient(s) ajouté(s) à la liste !", ToastAndroid.SHORT);
    }

    static async Add(ingredient) {
        var value = await this.getItem(ingredient.label);

        if(value !== null) {
            var same = this.isSameUnit(value.unit, ingredient.unit);
            if(same == 0) {
                value.quantite += ingredient.quantite;
            } else if(same > 0) {
                var v1 = 0;
                var v2 = 0;
                if(this.isLiquid(value.unit)) {
                    v1 = value.quantite * this.LValue[this.L.getIndexOf(value.unit)];
                    v2 = ingredient.quantite * this.LValue[this.L.getIndexOf(ingredient.unit)];

                    value.unit = "ml";
                } else {
                    v1 = value.quantite * this.gValue[this.g.getIndexOf(value.unit)];
                    v2 = ingredient.quantite * this.gValue[this.g.getIndexOf(ingredient.unit)];

                    value.unit = "g";
                }
                value.quantite = v1 + v2;
            } else {
                console.error("Une erreur est survenue lors de la mise en panier de : "+ingredient.label);
                return;
            }
        } else {
            value = ingredient;
        }

        await AsyncStorage.setItem(value.label, JSON.stringify(value));
    }

    static async Remove(ingredient) {
        await AsyncStorage.removeItem(ingredient.label);
    }

    static async clear() {
       await AsyncStorage.clear();
    }

    static isLiquid(Unit) {
        if(this.L.contains(Unit)) {
            return true;
        } 
        return false;
    }

    static isSameUnit(Unit1, Unit2) {
        if(Unit1 == Unit2) {
            return 0;
        }else if(this.g.contains(Unit1) && this.g.contains(Unit2) || this.L.contains(Unit1) && this.L.contains(Unit2)) {
            return 1;
        }

        return -1;
    }
}