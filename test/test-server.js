const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe("Blog Posts", function() {
 
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    
    it('should return blog posts on GET', function() {
        
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            const expectedKeys = ["id", "title", "content", "author", "publishDate"];
            res.body.forEach(function(item) {
                expect(item).to.be.a("object");
                expect(item).to.include.keys(expectedKeys);
            });
        });

    });
    
    
    it('should update blog posts on POST', function() {
        const newPost ={
            title: "HI IM A NEW BLOG POST",
            content: "The CONTENT",
            author: "YA Boi",
            publishDate: "tomorrow"
        }
        
        return chai.request(app)
        .post('/blog-posts')
        .send(newPost)
        .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a("object");
            expect(res.body).to.include.keys("id", "title", "content", "author", "publishDate");
            expect(res.body.id).to.not.equal(null);
        // response should be deep equal to `newItem` from above if we assign
        // `id` to it from `res.body.id`
            expect(res.body).to.deep.equal(Object.assign(newPost, { id: res.body.id }));
        });
        
    });
    
    
    
    
    it('should update blog posts on PUT', function() {
        const updatedPost = {
            title: "HI IM AN UPDATED BLOG POST",
            content: "The CONTENT",
            author: "YA Boi",
            publishDate: "tomorrow"
        };
        
        
        return chai.request(app) 
            .get('/blog-posts')
            .then(function(res) {
            updatedPost.id = res.body[0].id;
    
        
            return chai.request(app) 
            .put(`/blog-posts/${updatedPost.id}`)
            .send(updatedPost)
            })
            
            .then(function(res) {
              expect(res).to.have.status(204);
            })
        
    });
    
    
    it('should delete blog post on DELETE' , function() {
        return (chai.request(app)
                
        .get("/blog-posts")
        .then(function(res) {
            return chai.request(app)
            .delete(`/blog-posts/${res.body[0].id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        })
        );
    });
    
});