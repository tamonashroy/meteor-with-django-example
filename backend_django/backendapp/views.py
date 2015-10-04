from restless.modelviews import ListEndpoint, DetailEndpoint
from backendapp.models import Article

class ArticleList(ListEndpoint):
    model = Article

class ArticleDetail(DetailEndpoint):
    model = Article
