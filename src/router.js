import LoginView from './views/LoginView.js';
import RegisterView from './views/RegisterView.js';
import StoryListView from './views/StoryListView.js';
import StoryDetailView from './views/StoryDetailView.js';
import AddStoryView from './views/AddStoryView.js';

import LoginPresenter from './presenters/LoginPresenter.js';
import RegisterPresenter from './presenters/RegisterPresenter.js';
import StoryListPresenter from './presenters/StoryListPresenter.js';
import StoryDetailPresenter from './presenters/StoryDetailPresenter.js';
import AddStoryPresenter from './presenters/AddStoryPresenter.js';

const routes = {
  '/login': () => { const v=new LoginView(), p=new LoginPresenter(v); v.render(); },
  '/register': () => { const v=new RegisterView(), p=new RegisterPresenter(v); v.render(); },
  '/stories': () => { const v=new StoryListView(), p=new StoryListPresenter(v); v.render(); },
  '/stories/:id': () => {
    const v = new StoryDetailView(), p = new StoryDetailPresenter(v);
    v.render();
  },
  '/add': () => { const v=new AddStoryView(), p=new AddStoryPresenter(v); v.render(); },
};

export default function router() {
  const hash = window.location.hash.slice(1) || '/login';
  const route = Object.keys(routes).find(r => {
    if (r.includes(':')) {
      const base = r.split('/:')[0];
      return hash.startsWith(base);
    }
    return r === hash;
  }) || '/login';
  routes[route]();
}
