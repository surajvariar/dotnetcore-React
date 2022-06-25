

class CommentBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    }
    loadCommentsFromServer() {
        const xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = () => {
            const data = JSON.parse(xhr.responseText);
            this.setState({ data: data });
        };
        xhr.send();
    }
    handleCommentSubmit(comment) {
        //submit to the server and refresh list
        const data = JSON.stringify({
            "Author": comment.author,
            "Text": comment.text
        });

        const xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitUrl, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => this.loadCommentsFromServer();
        xhr.send(data);
    }

    componentWillMount() {
        this.loadCommentsFromServer();
        window.setInterval(
            () => this.loadCommentsFromServer(),
            this.props.pollInterval,
        );
    }

    render() {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
}

class CommentList extends React.Component {
    render() {
        const commentNodes = this.props.data.map(comment => (
            <Comment author={comment.author} key={comment.id}>
                {comment.text}
            </Comment>
        ));
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
}

class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            author: '',
            text: '',
        };
        this.handleAuthorChange = this.handleAuthorChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleAuthorChange(e) {
        this.setState({ author: e.target.value });
    }

    handleTextChange(e) {
        this.setState({ text: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        const author = this.state.author.trim();
        const text = this.state.text.trim();
        if (!text || !author) {
            return;
        }
        //sends request to the server with the details
        this.props.onCommentSubmit({ author: author, text: text });
        this.setState({
            author: '',
            text: '',
        });
    }

    render() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your Name" value={this.state.author} onChange={this.handleAuthorChange} />
                <input type="text" placeholder="Say Something ...." value={this.state.text} onChange={this.handleTextChange} />
                <input type="submit" placeholder="Post"  />
            </form>
        );
    }
}

class Comment extends React.Component {
    rawMarkup() {
        const md = createRemarkable();
        const rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };

    }
    render() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">{this.props.author}</h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
}

function createRemarkable() {
    var remarkable = 'undefined' != typeof global && global.Remarkable ? global.Remarkable : window.Remarkable;

    return new remarkable();
}

ReactDOM.render(<CommentBox url="/comments" submitUrl="comments/new" pollInterval={2000} />, document.getElementById('content'));