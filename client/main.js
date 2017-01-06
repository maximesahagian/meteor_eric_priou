import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.mytemplate.onCreated(function mytemplateOnCreated() {
  // counter starts at 0
});


Template.mytemplate.helpers({
  eleves: function(){
    return eleve.find();
  },
  matieres: function(){
    return matiere.find();
  },
  note_eleve: function(){

    var eleveId = arguments[0];


    var eleveActual = eleve.findOne({_id : eleveId});

    if(eleveActual.notes[this._id] != undefined && eleveActual.notes[this._id] != null){
      return eleveActual.notes[this._id];
    }


  },
  moyenne: function() {
    if (this._id != null && this._id != undefined) {
      var id = this._id;
      if (eleve.findOne({_id: id}).notes != null && eleve.findOne({_id: id}).notes != undefined) {

        var notes = eleve.findOne({_id: id}).notes;

        var total = 0;
        var size = 0;

        if (notes != null && notes != undefined) {
          for (note in notes) {
            total = total + notes[note];
            size++;
          }

          total = total / size;

          return total;
        }
        for (note in notes) {
          total = total + notes[note];
          size++;
        }

        total = total / size;

        return total;
      }
    }
  }
});

Meteor.methods({
  'deleteGame': function(){

  }
});

Template.mytemplate.events({
  'click .addeleve'(event, instance) {
    // increment the counter when button is clicked
    var firstname = document.querySelector("#firstname-eleve").value;
    var lastname = document.querySelector("#lastname-eleve").value;

    eleve.insert({firstname : firstname, lastname: lastname});
  },

  'click .addmatiere'(event, instance){
    var nameMatiere = document.querySelector("#name-matiere").value;
    var coefficient = document.querySelector("#coeff-matiere").value;

    if(nameMatiere != null && coefficient != null){
      matiere.insert({name:nameMatiere, coefficient: parseInt(coefficient)});
    }
  },

  'click .to-edit'(event, instance){
    if(!isEditing){
      var eleve_id = $(event.target).closest('tr').attr("data-eleve");
      var matiereName = this._id;
      var coefficient = this.coefficient;
      var closest = $(event.target).closest(".hide").one();
      $(event.target).closest('.hide').html("<input class='actualEdit' type='text' style='width: 97%; height: 91%; outline: none; position: absolute;' placeholder='Note à mettre'>").one();
      $( ".actualEdit" ).focus();
      var objectToPut = {name: matiereName, coefficient: coefficient, eleve: eleve_id, closest : closest};
      editActual = objectToPut;
      isEditing = true;
    }
  },

  'click'(event,instance){
    if(isEditing){
      if(!$(event.target).is("input")) {
        $('.actualEdit').hide();
        var object = editActual;
        var matiereName = object.name;
        var note = parseInt($('.actualEdit').val());
        var key = matiereName;
        var eleveToEdit = eleve.findOne({_id : object.eleve});
        var notesActual = eleveToEdit.notes;
        if(notesActual != null){
          var notes = notesActual;
          notes[key] = note;
        }
        else{
          var notes = {
            [key] : note
          }
        }

        var JSONobj = {
          notes: notes,
          firstname: eleve.findOne({_id: object.eleve}).firstname,
          lastname: eleve.findOne({_id: object.eleve}).lastname
        }

        eleve.update({_id: object.eleve}, JSONobj);
        isEditing = false;
        $(".actualEdit").closest("td").html('<div style="height: 100%; position: absolute; width: 100%; text-align: center;" class="to-edit">'+note+' </div>');
      }
    }
  },
  'keypress .actualEdit'(event){
    if (event.which === 13) {
      if(isEditing){
          $('.actualEdit').hide();
          var object = editActual;
          var matiereName = object.name;
          var note = parseInt($('.actualEdit').val());
          var key = matiereName;
          var eleveToEdit = eleve.findOne({_id : object.eleve});
          var notesActual = eleveToEdit.notes;

        if (!isNaN(note)){
          if(notesActual != null){
            var notes = notesActual;
            notes[key] = note;
          }
          else{
            var notes = {
              [key] : note
            }
          }

          var JSONobj = {
            notes: notes,
            firstname: eleve.findOne({_id: object.eleve}).firstname,
            lastname: eleve.findOne({_id: object.eleve}).lastname
          }
          eleve.update({_id: object.eleve}, JSONobj);
          isEditing = false;
          $(".actualEdit").closest("td").html('<div style="height: 100%; position: absolute; width: 100%; text-align: center;" class="to-edit">'+note+' </div>');
        }
        }
    }
  }
});
