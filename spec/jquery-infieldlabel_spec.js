Screw.Unit(function() {
  describe("jquery-infieldlabel", function() {
    //Clean up the labels after each run.
    after(function() { $(":text").inFieldLabels("remove"); });

    describe('when the label is applied with the default options', function() {
      before(function() { $("#basic_test").inFieldLabels("basic_test"); });

      it("should have a label associated with it", function() {
        expect($("#basic_test").inFieldLabels('get').length).to(equal, 1);
      });

      it("should have a label with text 'basic_test'", function() {
        expect($("#basic_test").inFieldLabels('get').text()).to(equal, 'basic_test');
      });
    });

    describe('when the label is removed', function() {
      before(function() { $("#remove_test").inFieldLabels("something").inFieldLabels("remove"); });
    
      it("should no longer exist", function() {
        expect($("#remove_test").inFieldLabels('get').length).to(equal, 0);
      });
    });
    
    describe("when the label is placed over an absolutely positioned element", function() {
      before(function() { $("#test_abs_pos").inFieldLabels("test_abs_pos"); });
      
      it("should display in the correct location", function() {
        expect($("#test_abs_pos").inFieldLabels('get').offset()).to(equal, $("#test_abs_pos").offset());
      });
    });
  });
});
