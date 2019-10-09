import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import app from '..';
import Auth from '../controllers';
import { newUser, invalidUserData, errorResponse, sinonMockResponse } from './dummy';
import Helpers from '../utils';

const { signup } = Auth;

chai.use(chaiHttp);
chai.use(sinonChai);

describe('Auth route endpoints', () => {
  const baseUrl = '/api/v1/auth';
  afterEach(() => {
    if (sinon.restore) sinon.restore();
  });
  describe('POST /api/v1/auth', () => {
    it('should signup a user successfully with a status of 201', async () => {
      const response = await chai
        .request(app)
        .post(`${baseUrl}/signup`)
        .send(newUser);
      const { data, status } = response.body;
      delete newUser.password;
      expect(response).to.have.status(201);
      expect(status).to.eql('success');
      expect(data.token).to.be.a('string');
      expect(response.body.data).to.include(newUser);
    });
    it('should prevent a user from registering with an existing email address', async () => {
      newUser.password = 'werirui1';
      const response = await chai
        .request(app)
        .post(`${baseUrl}/signup`)
        .send(newUser);
      const { error, status } = response.body;
      expect(response).to.have.status(409);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('A user with your email already exists');
    });
    it('should return an error response if user tries to register with invalid parameters', async () => {
      const response = await chai
        .request(app)
        .post(`${baseUrl}/signup`)
        .send(invalidUserData);
      const { error, status } = response.body;
      expect(response).to.have.status(400);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('A valid email address is required');
    });
    it('should return a 500 error response if something goes wrong while registering a user', async () => {
      const req = {
        body: { ...newUser, email: 'kinga@hotmail.com' }
      };
      const res = sinonMockResponse(sinon);
      sinon.stub(Helpers, 'generateToken').throws();
      await signup(req, res);
      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith(errorResponse);
    });
  });
});