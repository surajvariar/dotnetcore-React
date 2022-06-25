class CommentBox extends React.Component {
    render() {
        return (
            <div className="commentBox">Hello, world! I am a Comment Box. Nice to see you</div>
        );
    }
}

ReactDOM.render(<CommentBox />, document.getElementById('content'));