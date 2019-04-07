class Input
{
    constructor(_props)
    {
        this.props = _props;

        this.text = new TextInput(this.props);
        this.select = new SelectInput(this.props);
        this.datetime = new DateTimeInput(this.props);
        this.image = new ImageInput(this.props);
        this.color = new ColorInput(this.props);
        this.checkbox = new CheckBoxInput(this.props);
        this.radiogroup = new RadioGroupInput(this.props);

        this.fontsizepicker = new FontSizePickerInput(this.props);
    }
}