export default {
    "id": "01",
    "name": "Exercise 02 - Create simple class that contains another class",
    "targets": [
        "Target 1",
        "Target 2"
    ],
    "exercise_project_info": {
        "title": "ExerciseExerciseProjectInfo.java01",
        "starting_project": false
    },
    "requirements": [
        {
            "type": "class",
            "class_id": 1,
            "name": "PetShop",
            "related_requirements": [
                {
                    "type": "contains",
                    "main_class_id": 1,
                    "contain_class_id": 3,
                    "relation_type": "one_to_many"
                }
            ]
        },
        {
            "type": "class",
            "class_id": 2,
            "name": "Cat",
            "related_requirements": [
                {
                    "type": "extend",
                    "main_class_id": 2,
                    "extend_class_id": 3
                }
            ]
        },
        {
            "type": "class",
            "class_id": 3,
            "name": "Animal",
            "related_requirements": [

            ]
        }
    ]
};