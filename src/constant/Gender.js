class Gender{
    static MALE = new Gender("MALE")
    static FEMALE = new Gender("FEMALE")
    static OTHER = new Gender("OTHER")

    constructor(name){
        this.name = name
    }
}

export default Gender;