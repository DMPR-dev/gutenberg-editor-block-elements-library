class Input
{
    constructor(_props)
    {
        this.props = _props;

        this.text = new Text(this.props);
        this.select = new Select(this.props);
        this.datetime = new DateTime(this.props);
        this.image = new Image(this.props);
        this.color = new Color(this.props);
        this.checkbox = new CheckBox(this.props);
    }
}