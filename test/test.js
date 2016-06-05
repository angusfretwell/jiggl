import '../bootstrap';
import 'should';
import 'should-sinon';
import sinon from 'sinon';
import jira from 'jira-got';
import JiraHelper from '../lib/helpers/JiraHelper';

const EPIC_KEY_FIELD = [`customfield_${process.env.JIRA_EPIC_KEY_FIELD_ID}`];
const EPIC_NAME_FIELD = [`customfield_${process.env.JIRA_EPIC_NAME_FIELD_ID}`];
const GREENHOPPER_FIELD = [`customfield_${process.env.JIRA_GREENHOPPER_FIELD_ID}`];
const greenhopperField = ['com.atlassian.greenhopper.service.sprint.Sprint@1119b06[id=1,rapidViewId=1,state=FUTURE,name=Test Sprint,startDate=<null>,endDate=<null>,completeDate=<null>,sequence=1]']; // eslint-disable-line max-len

describe('JiraHelper', () => {
  let sandbox;
  let issue;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(jira, 'get').returns({
      body: {
        fields: {
          [EPIC_NAME_FIELD]: 'Example Epic',
        },
      },
    });
    sandbox.stub(jira, 'put');
    sandbox.stub(jira, 'post');

    issue = {
      fields: {
        [GREENHOPPER_FIELD]: null,
        [EPIC_KEY_FIELD]: null,
        issuetype: {},
        status: {},
        fixVersions: [],
        components: [],
        labels: [],
      },
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#getIssue()', () => {
    it('get an issue using the jira api', () => {
      JiraHelper.getIssue('TEST-123');
      jira.get.should.be.calledOnce();
      jira.get.should.be.calledWithExactly('issue/TEST-123');
    });
  });

  describe('#updateIssue()', () => {
    it('update an issue using the jira api', () => {
      JiraHelper.updateIssue('TEST-123', { key: 'value' });
      jira.put.should.be.calledOnce();
      jira.put.should.be.calledWithExactly('issue/TEST-123', {
        body: JSON.stringify({ fields: { key: 'value' } }),
      });
    });
  });

  describe('#createWorklog()', () => {
    it('create a worklog item for an issue using the jira api', () => {
      JiraHelper.createWorklog('TEST-123', { key: 'value' });
      jira.post.should.be.calledOnce();
      jira.post.should.be.calledWithExactly('issue/TEST-123/worklog', {
        body: JSON.stringify({ key: 'value' }),
      });
    });
  });

  describe('#updateWorklog()', () => {
    it('update a worklog item for an issue using the jira api', () => {
      JiraHelper.updateWorklog('TEST-123', 123, { key: 'value' });
      jira.put.should.be.calledOnce();
      jira.put.should.be.calledWithExactly('issue/TEST-123/worklog/123', {
        body: JSON.stringify({ key: 'value' }),
      });
    });
  });

  describe('#isActive()', () => {
    it('return false for an issue not in a sprint', () => {
      JiraHelper.isActive(issue).should.be.false();
    });

    it('return false for a closed issue', () => {
      issue.fields.status = { name: 'Closed' };
      issue.fields[GREENHOPPER_FIELD] = {};
      JiraHelper.isActive(issue).should.be.false();
    });

    it('return false for a resolved issue', () => {
      issue.fields.status = { name: 'Resolved' };
      issue.fields[GREENHOPPER_FIELD] = {};
      JiraHelper.isActive(issue).should.be.false();
    });

    it('return false for a done issue', () => {
      issue.fields.status = { name: 'Done' };
      issue.fields[GREENHOPPER_FIELD] = {};
      JiraHelper.isActive(issue).should.be.false();
    });

    it('return true for an open issue in a sprint', () => {
      issue.fields.status = { name: 'Open' };
      issue.fields[GREENHOPPER_FIELD] = {};
      JiraHelper.isActive(issue).should.be.true();
    });
  });

  describe('#getSprintName()', () => {
    it('get a sprint name from a greenhopper field', () => {
      JiraHelper.getSprintName(greenhopperField).should.equal('Test Sprint');
    });
  });

  describe('#getTags()', () => {
    it('should be empty when no tags are found', async () => {
      const tags = await JiraHelper.getTags(issue.fields);
      tags.should.be.empty();
    });

    it('should include the sprint name', async () => {
      issue.fields[GREENHOPPER_FIELD] = greenhopperField;
      const tags = await JiraHelper.getTags(issue.fields);
      tags.should.containEql('Test Sprint');
    });

    it('should include the issue type name', async () => {
      issue.fields.issuetype.name = 'Story';
      const tags = await JiraHelper.getTags(issue.fields);
      tags.should.containEql('Story');
    });

    it('should include version names', async () => {
      issue.fields.fixVersions.push({ name: 'v1.0.0' });
      const tags = await JiraHelper.getTags(issue.fields);
      tags.should.containEql('v1.0.0');
    });

    it('should include component names', async () => {
      issue.fields.components.push({ name: 'Example Component' });
      const tags = await JiraHelper.getTags(issue.fields);
      tags.should.containEql('Example Component');
    });

    it('should include labels', async () => {
      issue.fields.labels.push('example_label');
      const tags = await JiraHelper.getTags(issue.fields);
      tags.should.containEql('example_label');
    });

    it('should include the epic name', async () => {
      issue.fields[EPIC_KEY_FIELD] = 'TEST-123';
      const tags = await JiraHelper.getTags(issue.fields);
      jira.get.should.be.calledOnce();
      jira.get.should.be.calledWithExactly('issue/TEST-123');
      tags.should.containEql('Example Epic');
    });
  });
});
